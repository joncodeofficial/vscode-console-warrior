import * as vscode from 'vscode';
import { ConsoleDataMap, ConsoleDataMapValues } from './types';
import { formatLocalTimestamp } from './utils';
import { DECORATOR_COLORS } from './constants';

let currentPanel: vscode.WebviewPanel | undefined;
let storedConsoleDataMap: ConsoleDataMap | undefined;

const TYPE_LABELS: Record<string, string> = {
  log: 'LOG',
  warn: 'WARN',
  error: 'ERROR',
  info: 'INFO',
  debug: 'DEBUG',
  table: 'TABLE',
};

type GroupData = {
  line: string;
  type: string;
  typeColor: string;
  label: string;
  counter: number;
  messages: { body: string; time: string }[];
};

function extractGroups(
  consoleDataMap: ConsoleDataMap,
  editor: vscode.TextEditor
): { groups: GroupData[]; fileName: string } {
  const currentFilePath = editor.document.uri.fsPath;
  const isDark =
    vscode.window.activeColorTheme.kind === vscode.ColorThemeKind.Dark ||
    vscode.window.activeColorTheme.kind === vscode.ColorThemeKind.HighContrast;
  const colors = isDark ? DECORATOR_COLORS.dark : DECORATOR_COLORS.light;

  let matchedPositionsMap: Map<string, ConsoleDataMapValues> | undefined;
  for (const [fileKey, positionsMap] of consoleDataMap) {
    const filePath = fileKey.includes('::') ? fileKey.split('::')[1] : fileKey;
    if (currentFilePath.endsWith(filePath)) {
      matchedPositionsMap = positionsMap;
      break;
    }
  }

  const groups: GroupData[] = [];
  if (matchedPositionsMap) {
    const sorted = [...matchedPositionsMap.entries()].sort(
      (a, b) => parseInt(a[0]) - parseInt(b[0])
    );
    for (const [lineStr, { consoleMessages, type, counter }] of sorted) {
      groups.push({
        line: lineStr,
        type,
        typeColor: colors[type] || colors.log,
        label: TYPE_LABELS[type] || type.toUpperCase(),
        counter,
        messages: consoleMessages.toArray().map((m) => ({
          body: m.message,
          time: formatLocalTimestamp(m.timestamp),
        })),
      });
    }
  }

  const fileName = editor.document.fileName.split('/').pop() || editor.document.fileName;
  return { groups, fileName };
}

function getNonce(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let nonce = '';
  for (let i = 0; i < 32; i++) {
    nonce += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return nonce;
}

function buildHtml(webview: vscode.Webview, extensionUri: vscode.Uri, initialData: string): string {
  const nonce = getNonce();
  const toUri = (...p: string[]) => webview.asWebviewUri(vscode.Uri.joinPath(extensionUri, ...p));
  const cssUri = toUri('media', 'panel.css');
  const jsUri = toUri('media', 'panel.js');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="Content-Security-Policy"
    content="default-src 'none'; style-src ${webview.cspSource}; script-src 'nonce-${nonce}';">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="stylesheet" href="${cssUri}">
  <title>Console Warrior</title>
</head>
<body>
  <div class="header">
    <div class="title" id="title"></div>
    <div class="search-wrapper">
      <input class="search-input" id="search" type="text" placeholder="Filter messages..." />
    </div>
    <hr class="divider">
  </div>
  <div class="content" id="content"></div>
  <script nonce="${nonce}">var PANEL_DATA = ${initialData};</script>
  <script nonce="${nonce}" src="${jsUri}"></script>
</body>
</html>`;
}

export function showConsoleWarriorPanel(
  context: vscode.ExtensionContext,
  consoleDataMap: ConsoleDataMap
) {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    vscode.window.showInformationMessage('Console Warrior: No active editor');
    return;
  }

  storedConsoleDataMap = consoleDataMap;
  const { groups, fileName } = extractGroups(consoleDataMap, editor);

  if (currentPanel) {
    currentPanel.webview.postMessage({ type: 'update', groups, fileName });
    currentPanel.reveal(vscode.ViewColumn.Beside, true);
  } else {
    const iconPath = vscode.Uri.joinPath(context.extensionUri, 'images', 'icon.png');
    currentPanel = vscode.window.createWebviewPanel(
      'consoleWarriorPanel',
      'Console Warrior',
      { viewColumn: vscode.ViewColumn.Beside, preserveFocus: true },
      {
        enableScripts: true,
        localResourceRoots: [vscode.Uri.joinPath(context.extensionUri, 'media')],
      }
    );
    currentPanel.iconPath = iconPath;
    const initialData = JSON.stringify({ groups, fileName });
    currentPanel.webview.html = buildHtml(currentPanel.webview, context.extensionUri, initialData);
    currentPanel.onDidDispose(() => {
      currentPanel = undefined;
    });
  }
}

export function updateConsoleWarriorPanel() {
  if (!currentPanel || !storedConsoleDataMap) return;
  const editor = vscode.window.activeTextEditor;
  if (!editor) return;
  const { groups, fileName } = extractGroups(storedConsoleDataMap, editor);
  currentPanel.webview.postMessage({ type: 'update', groups, fileName });
}
