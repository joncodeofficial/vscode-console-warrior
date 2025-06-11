import * as vscode from 'vscode';
import WebSocket from 'ws';
import { monitoringChanges } from './monitoringChanges';
import { IConsoleData } from './types/consoleData.interface';
import { sourceMapping } from './sourceMapping';
import { updateConsoleDataMap } from './updateConsoleDataMap';
import { watcherNodeModules } from './utils/watcherNodeModules';
import { IConsoleDataMap } from './types/consoleDataMap.interface';
import { decorationType, renderDecorations } from './renderDecorations';
import { ISourceMapCache } from './types/sourceMapCache.interface';
import { connectToMainWS } from './connectToMainWS';
import { startMainSW } from './startMainSW';
import { IServerConnections } from './types/serverConnections.interface';
import { addConsoleWarriorPort } from './commands/addConsoleWarriorPort';
import { removeCommentedConsoles } from './utils/removeCommentedConsoles';

let socket: WebSocket | null = null;
const consoleData: IConsoleData[] = [];
const sourceMapCache: ISourceMapCache = new Map();
const consoleDataMap: IConsoleDataMap = new Map();
const serverConnections: IServerConnections = new Map();

export function activate(context: vscode.ExtensionContext) {
  let connectPort: number = context.workspaceState.get('port') ?? 0;

  // Start Main Server
  startMainSW(consoleData, sourceMapCache, consoleDataMap, serverConnections);

  // Connect to Main Server like a client
  socket = connectToMainWS(connectPort, consoleData);

  monitoringChanges(consoleData, async () => {
    const newConsoleData = await sourceMapping(consoleData, sourceMapCache);

    // Early return if no new data
    if (!newConsoleData?.length) return;

    const editor = vscode.window.activeTextEditor;

    updateConsoleDataMap(editor, newConsoleData, consoleDataMap);
    renderDecorations(editor, consoleDataMap);

    consoleData.length = 0;
  });

  vscode.workspace.onDidChangeTextDocument((editor) => {
    const activeEditor = vscode.window.activeTextEditor;
    // Ignore if empty changes
    if (editor.contentChanges.length === 0) return;
    // If the active editor is the same as the current editor
    if (activeEditor && editor.document === activeEditor.document) {
      removeCommentedConsoles(editor, consoleDataMap);
    }
    // Render decorations again
    renderDecorations(vscode.window.activeTextEditor, consoleDataMap);
  });

  context.subscriptions.push(watcherNodeModules(vscode)!);

  context.subscriptions.push(addConsoleWarriorPort(context, socket, consoleData));
}

export function deactivate() {
  if (decorationType) {
    decorationType.dispose();
  }
}
