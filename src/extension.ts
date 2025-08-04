import * as vscode from 'vscode';
import { monitoringChanges } from './monitoringChanges';
import { sourceMapping } from './sourceMapping';
import { updateConsoleDataMap } from './updateConsoleDataMap';
import { watcherNodeModules } from './watcherNodeModules';
import { decorationType, renderDecorations } from './renderDecorations';
import { removeDecorations } from './removeDecorations';
import { connectToMainWS } from './connectToMainWS';
import { startMainSW } from './startMainSW';
import { ServerConnections, ConsoleData, ConsoleDataMap, SourceMapCache } from './types';
import { commandConnectPort } from './commands/commandConnectPort';
import { DEFAULT_PORT } from './constants';
import { disposable } from './utils';

const consoleData: ConsoleData[] = [];
const sourceMapCache: SourceMapCache = new Map();
const consoleDataMap: ConsoleDataMap = new Map();
const serverConnections: ServerConnections = new Map();

export function activate(context: vscode.ExtensionContext) {
  let connectPort: number = context.workspaceState.get('warrior-port') ?? DEFAULT_PORT;

  // Start Main Server
  startMainSW(consoleData, sourceMapCache, consoleDataMap, serverConnections);
  // Connect to Main Server like a client
  const socket = connectToMainWS(connectPort, consoleData);

  const stopMonitoring = monitoringChanges(consoleData, async () => {
    const newConsoleData = await sourceMapping(consoleData, sourceMapCache);
    // Early return if no new data
    if (!newConsoleData?.length) return;
    const editor = vscode.window.activeTextEditor;
    updateConsoleDataMap(editor, newConsoleData, consoleDataMap);
    renderDecorations(editor, consoleDataMap);
    consoleData.length = 0;
  });

  const onTextChangeDisposable = vscode.workspace.onDidChangeTextDocument((textEditor) => {
    const activeEditor = vscode.window.activeTextEditor;
    // Ignore if empty changes
    if (textEditor.contentChanges.length === 0) return;
    // If the active editor is the same as the current editor
    if (activeEditor && textEditor.document === activeEditor.document) {
      removeDecorations(textEditor, consoleDataMap);
      renderDecorations(vscode.window.activeTextEditor, consoleDataMap);
    }
  });

  context.subscriptions.push(watcherNodeModules(vscode)!);
  context.subscriptions.push(disposable(() => stopMonitoring()));
  context.subscriptions.push(disposable(() => socket?.close()));
  context.subscriptions.push(disposable(() => decorationType.dispose()));
  context.subscriptions.push(commandConnectPort(context, socket, consoleData));
  context.subscriptions.push(onTextChangeDisposable);
}

export function deactivate() {}
