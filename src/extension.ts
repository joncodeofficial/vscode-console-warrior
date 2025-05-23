import * as vscode from "vscode";
import WebSocket from "ws";
import { monitoringChanges } from "./monitoringChanges";
import { UPDATE_RATE } from "./constants";
import { IConsoleData } from "./types/consoleData.interface";
import { sourceMapping } from "./sourceMapping";
import { createProxy } from "./createProxy";
import { updateConsoleDataMap } from "./updateConsoleDataMap";
import { watcherNodeModules } from "./utils/watcherNodeModules";
import { broadcastToClients } from "./utils/broadcastToClients";
import { IConsoleDataMap } from "./types/consoleDataMap.interface";
import { renderDecorations } from "./renderDecorations";
import { ISourceMapCache } from "./types/sourceMapCache.interface";
import { isConsoleLogCorrect } from "./utils/isConsoleLogCorrect";

let decorationType: vscode.TextEditorDecorationType;
const wss = new WebSocket.Server({ port: 27029 });
const consoleData: IConsoleData[] = [];
const sourceMapCache: ISourceMapCache = new Map();
const consoleDataMap: IConsoleDataMap = new Map();

// Create the decoration type
decorationType = vscode.window.createTextEditorDecorationType({
  color: "#00FF00", // Color green
  textDecoration: "none; pointer-events: none;",
  rangeBehavior: vscode.DecorationRangeBehavior.ClosedClosed,
});

export function activate(context: vscode.ExtensionContext) {
  // Configure the HTTP proxy
  createProxy();

  // Send message to all connected clients
  wss.on("connection", (ws) => {
    console.log("Cliente conectado al WebSocket");

    consoleData.length = 0;
    sourceMapCache.clear();
    consoleDataMap.clear();

    ws.on("message", (message) => {
      try {
        const data: IConsoleData = JSON.parse(message.toString());
        // console.log(data);
        if (data.message !== "") consoleData.push(data);
      } catch (e) {
        console.warn("Error parsing WebSocket message");
      }
    });
  });

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

  vscode.workspace.onDidSaveTextDocument(
    async (document: vscode.TextDocument) => {
      const editor = vscode.window.activeTextEditor;
      if (editor && editor.document === document) {
        // First enable auto-reload
        // broadcastToClients(wss, { type: "enableAutoReload" });
        // Then send reload command
        // broadcastToClients(wss, { type: "reload" });
        // consoleData.length = 0;
        // sourceMapCache.clear();
        // consoleDataMap.clear();
        // vscode.window.activeTextEditor?.setDecorations(decorationType, []);
      }
    }
  );

  vscode.workspace.onDidChangeTextDocument((editor) => {
    const activeEditor = vscode.window.activeTextEditor;
    // Ignore  if empty changes
    if (editor.contentChanges.length === 0) return;
    // If the active editor is the same as the current editor
    if (activeEditor && editor.document === activeEditor.document) {
      const filePath = editor.document.uri.fsPath;
      // Walk through all lines with decorations in the current file
      for (const [file, innerMap] of consoleDataMap) {
        if (filePath.endsWith(file)) {
          for (const [key] of innerMap) {
            const lineText = editor.document.lineAt(parseInt(key) - 1).text;

            if (!isConsoleLogCorrect(lineText) && innerMap.has(key)) {
              innerMap.delete(key);
            }
          }
          if (innerMap.size === 0) consoleDataMap.delete(file);
        }
      }
    }

    // Render decorations again
    renderDecorations(
      vscode.window.activeTextEditor,
      decorationType,
      consoleDataMap
    );
  });

  context.subscriptions.push(watcherNodeModules(vscode)!);
}

export function deactivate() {
  if (decorationType) {
    decorationType.dispose();
  }
}
