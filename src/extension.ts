import * as vscode from "vscode";
import WebSocket from "ws";
import { monitoringChanges } from "./monitoringChanges";
import { UPDATE_RATE, WS_PORT } from "./constants";
import { IConsoleData } from "./types/consoleData.interface";
import { sourceMapping } from "./sourceMapping";
import { createProxy } from "./createProxy";
import { updateConsoleDataMap } from "./updateConsoleDataMap";
import { watcherNodeModules } from "./utils/watcherNodeModules";
import { IConsoleDataMap } from "./types/consoleDataMap.interface";
import { renderDecorations } from "./renderDecorations";
import { ISourceMapCache } from "./types/sourceMapCache.interface";
import { connectToCentralWS } from "./connectToCentralWS";
import { startCentralSW } from "./startCentralSW";
import { IBackendConnections } from "./types/backendConnections.interface";
import { addConsoleWarriorPort } from "./commands/addConsoleWarriorPort";
import { removeCommentedConsoles } from "./utils/removeCommentedConsoles";

let decorationType: vscode.TextEditorDecorationType;
let socket: WebSocket | null = null;
const consoleData: IConsoleData[] = [];
const sourceMapCache: ISourceMapCache = new Map();
const consoleDataMap: IConsoleDataMap = new Map();
const backendConnections: IBackendConnections = new Map();

// Create the decoration type
decorationType = vscode.window.createTextEditorDecorationType({
  color: "#00FF00", // Color green
  textDecoration: "none; pointer-events: none;",
  rangeBehavior: vscode.DecorationRangeBehavior.ClosedClosed,
});

export function activate(context: vscode.ExtensionContext) {
  startCentralSW(
    consoleData,
    sourceMapCache,
    consoleDataMap,
    backendConnections
  );

  socket = connectToCentralWS(
    WS_PORT,
    context.workspaceState.get("port") ?? 0,
    consoleData
  );

  monitoringChanges(
    consoleData,
    async () => {
      const newConsoleData = await sourceMapping(consoleData, sourceMapCache);
      if (!newConsoleData || newConsoleData.length === 0) return;

      updateConsoleDataMap(
        vscode.window.activeTextEditor,
        newConsoleData,
        consoleDataMap
      );

      renderDecorations(
        vscode.window.activeTextEditor,
        decorationType,
        consoleDataMap
      );
      consoleData.length = 0;
    },
    UPDATE_RATE
  );

  // vscode.workspace.onDidSaveTextDocument(
  //   async (document: vscode.TextDocument) => {
  //     const editor = vscode.window.activeTextEditor;
  //     if (editor && editor.document === document) {
  //       // First enable auto-reload
  //       // broadcastToClients(wss, { type: "enableAutoReload" });
  //       // Then send reload command
  //       // broadcastToClients(wss, { type: "reload" });
  //       // consoleData.length = 0;
  //       // sourceMapCache.clear();
  //       // consoleDataMap.clear();
  //       // vscode.window.activeTextEditor?.setDecorations(decorationType, []);
  //     }
  //   }
  // );

  vscode.workspace.onDidChangeTextDocument((editor) => {
    const activeEditor = vscode.window.activeTextEditor;
    // Ignore  if empty changes
    if (editor.contentChanges.length === 0) return;
    // If the active editor is the same as the current editor
    if (activeEditor && editor.document === activeEditor.document) {
      removeCommentedConsoles(editor, consoleDataMap);
    }

    // Render decorations again
    renderDecorations(
      vscode.window.activeTextEditor,
      decorationType,
      consoleDataMap
    );
  });

  context.subscriptions.push(watcherNodeModules(vscode)!);

  context.subscriptions.push(
    addConsoleWarriorPort(context, socket, consoleData)
  );
}

export function deactivate() {
  if (decorationType) {
    decorationType.dispose();
  }
}
