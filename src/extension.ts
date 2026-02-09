import * as vscode from 'vscode';
import { monitoringChanges } from './monitoringChanges';
import { sourceMapping } from './sourceMapping';
import { updateConsoleDataMap } from './updateConsoleDataMap';
import { watcherNodeModules } from './watcherNodeModules';
import { decorationType, renderDecorations } from './renderDecorations';
import { removeDecorations } from './removeDecorations';
import { startWebSocketServer, connectWebSocketServer } from './webSocketServer';
import { ServerConnections, ConsoleData, ConsoleDataMap, SourceMapCache } from './types';
import { DEFAULT_PORT } from './constants';
import { disposable } from './utils';
import { hoverMessageProvider } from './hoverMessageProvider';
import { getMessage } from './messageStore';

const consoleData: ConsoleData[] = [];
const sourceMapCache: SourceMapCache = new Map();
const consoleDataMap: ConsoleDataMap = new Map();
const serverConnections: ServerConnections = new Map();

export async function activate(context: vscode.ExtensionContext) {
  const connectPort: number = DEFAULT_PORT;

  // Start Main Server
  const main = await startWebSocketServer(
    consoleData,
    sourceMapCache,
    consoleDataMap,
    serverConnections
  );

  // Connect to Main Server like a client
  const socket = connectWebSocketServer(
    connectPort,
    consoleData,
    sourceMapCache,
    consoleDataMap,
    serverConnections
  );

  // Register hover provider once
  const hoverProvider = vscode.languages.registerHoverProvider(
    { scheme: 'file', pattern: '**/*.{js,mjs,ts,mts,jsx,tsx,vue,svelte}' },
    hoverMessageProvider(() => consoleDataMap)
  );

  // Register command to copy console message (looks up by ID from the store)
  const copyMessageCommand = vscode.commands.registerCommand(
    'consoleWarrior.copyMessage',
    async (id: string) => {
      const message = getMessage(id);
      if (message) await vscode.env.clipboard.writeText(message);
    }
  );

  const stopMonitoring = monitoringChanges(consoleData, async () => {
    const newConsoleData = await sourceMapping(consoleData, sourceMapCache);
    consoleData.length = 0;
    // Early return if no new data
    if (!newConsoleData?.length) return;
    const editor = vscode.window.activeTextEditor;
    // Early return if no active editor
    if (!editor) return;
    updateConsoleDataMap(editor, newConsoleData, consoleDataMap);
    renderDecorations(editor, consoleDataMap);
  });

  const onTextChangeDisposable = vscode.workspace.onDidChangeTextDocument((textEditor) => {
    const activeEditor = vscode.window.activeTextEditor;
    // Ignore if empty changes
    if (textEditor.contentChanges.length === 0) return;
    // If the active editor is the same as the current editor
    if (activeEditor && textEditor.document === activeEditor.document) {
      removeDecorations(textEditor, consoleDataMap);
      renderDecorations(activeEditor, consoleDataMap);
    }
  });

  context.subscriptions.push(watcherNodeModules(vscode)!);
  context.subscriptions.push(disposable(() => stopMonitoring()));
  context.subscriptions.push(disposable(() => main?.close()));
  context.subscriptions.push(disposable(() => socket?.close()));
  context.subscriptions.push(disposable(() => decorationType.dispose()));
  context.subscriptions.push(onTextChangeDisposable);
  context.subscriptions.push(hoverProvider);
  context.subscriptions.push(copyMessageCommand);
}

export function deactivate() {}
