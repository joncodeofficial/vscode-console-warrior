import * as vscode from "vscode";
import WebSocket from "ws";
import { monitorChanges } from "./services/monitoring";
import { UPDATE_RATE } from "./constants";
import { IConsoleData } from "./types/consoleData.interface";
import { sourceMap } from "./sourceMap";
import { CreateProxy } from "./proxy";
import { updateDecorations } from "./updateDecorations";
import { addConsoleWarriorPlugin } from "./commands/addConsoleWarriorPlugin";
import path from "path";
import fs from "fs";

let decorationType: vscode.TextEditorDecorationType;
const wss = new WebSocket.Server({ port: 9000 });
const consoleData: IConsoleData[] = [];
const newConsoleData: IConsoleData[] = [];
const sourceMapCache = new Map();

function broadcastToClients(wss: WebSocket.Server, message: any) {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(message));
    }
  });
}

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
        const data = JSON.parse(message as any);
        console.log(data);
        // Aquí puedes manejar otros tipos de mensajes
        newConsoleData.push(data);
      } catch (e) {
        console.warn("Error parsing WebSocket message", e);
      }
    });
  });

  // Crear el tipo de decoración
  decorationType = vscode.window.createTextEditorDecorationType({
    color: "#00FF00", // Color verde
    textDecoration: "none; pointer-events: none;", // No seleccionable
    rangeBehavior: vscode.DecorationRangeBehavior.ClosedClosed,
  });

  // Evento para detectar cambios en el documento
  const changeTextDocument = vscode.workspace.onDidChangeTextDocument(
    async (event: vscode.TextDocumentChangeEvent) => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) return;
    }
  );

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

  context.subscriptions.push(changeTextDocument);

  const workspacePath = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
  if (!workspacePath) return;

  const nodeModulesPath = path.join(workspacePath, "node_modules");

  // If already exists, check if it's ready
  if (fs.existsSync(nodeModulesPath)) {
    checkIfNodeModulesReady(nodeModulesPath).then((ready) => {
      if (ready) {
        onNodeModulesReady(nodeModulesPath);
        addConsoleWarriorPlugin(vscode);
        vscode.window.showInformationMessage(
          "Este se ejecuta cuando reload o se inicia el workspace"
        );
      }
    });
    return;
  }

  // Watch for folder creation
  const watcher = vscode.workspace.createFileSystemWatcher(
    new vscode.RelativePattern(workspacePath, "node_modules"),
    false,
    true,
    true
  );

  watcher.onDidCreate(async () => {
    const ready = await checkIfNodeModulesReady(nodeModulesPath);
    if (ready) {
      addConsoleWarriorPlugin(vscode);
      vscode.window.showInformationMessage(
        "Este se ejecuta cuando se crea el node_modules"
      );
      onNodeModulesReady(nodeModulesPath);
    }
    watcher.dispose();
  });

  context.subscriptions.push(watcher);
}

export function deactivate() {
  if (decorationType) {
    decorationType.dispose();
  }
}

async function checkIfNodeModulesReady(
  dir: string,
  maxTries = 20,
  delay = 500
): Promise<boolean> {
  for (let i = 0; i < maxTries; i++) {
    try {
      const items = fs.readdirSync(dir).filter((name) => !name.startsWith("."));
      if (items.length > 0) return true;
    } catch {}
    await new Promise((r) => setTimeout(r, delay));
  }
  return false;
}

function onNodeModulesReady(dir: string) {
  vscode.window.showInformationMessage(`node_modules is ready at: ${dir}`);
  // your logic here
}
