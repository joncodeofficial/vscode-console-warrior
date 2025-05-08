import * as vscode from "vscode";
import WebSocket from "ws";
import { monitorChanges } from "./services/monitoring";
import { UPDATE_RATE } from "./constants";
import { IConsoleData } from "./types/consoleData.interface";
import { sourceMap } from "./sourceMap";
import { CreateProxy } from "./proxy";
import { updateDecorations } from "./updateDecorations";
import { watcherNodeModules } from "./utils/watcherNodeModules";
import { broadcastToClients } from "./utils/broadcastToClients";

let decorationType: vscode.TextEditorDecorationType;
const wss = new WebSocket.Server({ port: 9000 });
const consoleData: IConsoleData[] = [];
const newConsoleData: IConsoleData[] = [];
const sourceMapCache = new Map();

// Crear el tipo de decoración
decorationType = vscode.window.createTextEditorDecorationType({
  color: "#00FF00", // Color verde
  textDecoration: "none; pointer-events: none;", // No seleccionable
  rangeBehavior: vscode.DecorationRangeBehavior.ClosedClosed,
});

export function activate(context: vscode.ExtensionContext) {
  // Configurar el proxy HTTP
  CreateProxy();

  monitorChanges(
    newConsoleData,
    async () => {
      const temp = await sourceMap(newConsoleData, sourceMapCache);
      if (temp && temp.length > 0) {
        consoleData.push(...temp);
        updateDecorations(
          vscode.window.activeTextEditor!,
          consoleData,
          decorationType
        );
        newConsoleData.length = 0;
      }
    },
    UPDATE_RATE
  );

  // Enviar mensaje a todos los clientes conectados
  wss.on("connection", (ws) => {
    console.log("Cliente conectado al WebSocket");

    consoleData.length = 0;
    newConsoleData.length = 0;
    sourceMapCache.clear();

    ws.on("message", (message) => {
      try {
        // console.log(message);
        const data = JSON.parse(message as any);
        // console.log(data);
        // Aquí puedes manejar otros tipos de mensajes
        newConsoleData.push(data);
      } catch (e) {
        console.warn("Error parsing WebSocket message", e);
      }
    });
  });

  // // Evento para detectar cambios en el documento
  // const changeTextDocument = vscode.workspace.onDidChangeTextDocument(
  //   async (event: vscode.TextDocumentChangeEvent) => {
  //     const editor = vscode.window.activeTextEditor;
  //     if (!editor) return;
  //   }
  // );

  vscode.workspace.onDidSaveTextDocument(
    async (document: vscode.TextDocument) => {
      const editor = vscode.window.activeTextEditor;
      if (editor && editor.document === document) {
        // Primero habilitamos el auto-reload
        broadcastToClients(wss, { type: "enableAutoReload" });
        // Luego enviamos el comando de recarga
        broadcastToClients(wss, { type: "reload" });
      }
    }
  );

  // context.subscriptions.push(changeTextDocument);
  context.subscriptions.push(watcherNodeModules(vscode)!);
}

export function deactivate() {
  if (decorationType) {
    decorationType.dispose();
  }
}
