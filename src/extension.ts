import * as vscode from "vscode";
import WebSocket from "ws";
import { monitorChanges } from "./services/monitoring";
import { UPDATE_RATE } from "./constants";
import { IConsoleData } from "./types/consoleData.interface";
import { sourceMapping } from "./sourceMapping";
import { CreateProxy } from "./proxy";
import { updateDecorations } from "./updateDecorations";
import { watcherNodeModules } from "./utils/watcherNodeModules";
import { broadcastToClients } from "./utils/broadcastToClients";

let decorationType: vscode.TextEditorDecorationType;
const wss = new WebSocket.Server({ port: 9000 });
const consoleData: IConsoleData[] = [];
const sourceMapCache = new Map();
const consoleDataMap = new Map<string, Map<string, string[]>>();

// Create the decoration type
decorationType = vscode.window.createTextEditorDecorationType({
  color: "#00FF00", // Color green
  textDecoration: "none; pointer-events: none;",
  rangeBehavior: vscode.DecorationRangeBehavior.ClosedClosed,
});

export function activate(context: vscode.ExtensionContext) {
  // Configure the HTTP proxy
  CreateProxy();

  monitorChanges(
    consoleData,
    async () => {
      const newConsoleData = await sourceMapping(consoleData, sourceMapCache);
      if (!newConsoleData || newConsoleData.length === 0) return;
      updateDecorations(
        vscode.window.activeTextEditor!,
        newConsoleData,
        decorationType,
        consoleDataMap
      );
      consoleData.length = 0;
    },
    UPDATE_RATE
  );

  // Send message to all connected clients
  wss.on("connection", (ws) => {
    console.log("Cliente conectado al WebSocket");

    consoleData.length = 0;
    sourceMapCache.clear();
    consoleDataMap.clear();

    ws.on("message", (message) => {
      try {
        const data: IConsoleData = JSON.parse(message.toString());
        consoleData.push(data);
        console.log(data);
      } catch (e) {
        console.warn("Error parsing WebSocket message");
      }
    });
  });

  vscode.workspace.onDidSaveTextDocument(
    async (document: vscode.TextDocument) => {
      const editor = vscode.window.activeTextEditor;
      if (editor && editor.document === document) {
        // First enable auto-reload
        broadcastToClients(wss, { type: "enableAutoReload" });
        // Then send reload command
        broadcastToClients(wss, { type: "reload" });
      }
    }
  );

  context.subscriptions.push(watcherNodeModules(vscode)!);
}

export function deactivate() {
  if (decorationType) {
    decorationType.dispose();
  }
}
