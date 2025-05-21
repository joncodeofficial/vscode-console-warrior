import * as vscode from "vscode";
import WebSocket from "ws";
import { monitorChanges } from "./services/monitoring";
import { UPDATE_RATE } from "./constants";
import { IConsoleData } from "./types/consoleData.interface";
import { sourceMapping } from "./sourceMapping";
import { CreateProxy } from "./proxy";
import { updateConsoleDataMap } from "./updateConsoleDataMap";
import { watcherNodeModules } from "./utils/watcherNodeModules";
import { broadcastToClients } from "./utils/broadcastToClients";
import { TraceMap } from "@jridgewell/trace-mapping";
import { IConsoleDataMap } from "./types/consoleDataMap.interface";
import { renderDecorations } from "./renderDecorations";

let decorationType: vscode.TextEditorDecorationType;
const wss = new WebSocket.Server({ port: 9000 });
const consoleData: IConsoleData[] = [];
const sourceMapCache = new Map<string, TraceMap>();
const consoleDataMap: IConsoleDataMap = new Map();

// Create the decoration type
decorationType = vscode.window.createTextEditorDecorationType({
  color: "#00FF00", // Color green
  textDecoration: "none; pointer-events: none;",
  rangeBehavior: vscode.DecorationRangeBehavior.ClosedClosed,
});

export function activate(context: vscode.ExtensionContext) {
  // Configure the HTTP proxy
  CreateProxy();

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
        consoleData.push(data);
      } catch (e) {
        console.warn("Error parsing WebSocket message");
      }
    });
  });

  monitorChanges(
    consoleData,
    async () => {
      const newConsoleData = await sourceMapping(consoleData, sourceMapCache);
      if (!newConsoleData || newConsoleData.length === 0) return;

      updateConsoleDataMap(
        vscode.window.activeTextEditor,
        newConsoleData,
        consoleDataMap
      );

      // renderDecorations(
      //   vscode.window.activeTextEditor,
      //   decorationType,
      //   consoleDataMap
      // );

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
    if (editor) {
      if (!editor || !editor.document) return;

      const filePath = editor.document.uri.fsPath;
      // Recorre todas las líneas con decoraciones en el archivo actual
      for (const [file, innerMap] of consoleDataMap) {
        if (filePath.endsWith(file)) {
          for (const [key, values] of innerMap) {
            const lineNumber = parseInt(key);
            const lineText = editor.document.lineAt(lineNumber - 1).text;

            console.log(key, "key");
            console.log(`Línea ${lineNumber}: ${lineText}`);

            if (!isConsoleLogCorrect(lineText) && innerMap.has(key)) {
              innerMap.delete(key); // 👈 Aquí va el delete correcto
              console.log(
                `❌ Eliminando decoraciones de la línea ${lineNumber}`
              );
            }
          }
        }
      }

      // Vuelve a renderizar las decoraciones después de limpiar
      renderDecorations(
        vscode.window.activeTextEditor,
        decorationType,
        consoleDataMap
      );
    }
  });

  context.subscriptions.push(watcherNodeModules(vscode)!);
}

export function deactivate() {
  if (decorationType) {
    decorationType.dispose();
  }
}

export function isConsoleLogCorrect(line: string): boolean {
  // Verifica si hay un console.log en un comentario
  // Comentario de línea //
  if (/^\s*\/\/.*console\.log/.test(line)) {
    return false;
  }

  // Comentario de bloque /* */ (completo en una línea)
  if (/^\s*\/\*.*console\.log.*\*\//.test(line)) {
    return false;
  }

  // Dentro de un comentario de bloque multilínea
  // Detecta línea que comienza con /* y contiene console.log
  if (/^\s*\/\*.*console\.log/.test(line) && !line.includes("*/")) {
    return false;
  }

  // Detecta línea dentro de un comentario multilinea (comienza con * o tiene * al inicio de texto)
  if (
    /^\s*\*.*console\.log/.test(line) &&
    !line.includes("*/") &&
    !line.includes("/*")
  ) {
    return false;
  }

  // Detecta una línea que termina un comentario multilinea y contiene console.log
  if (
    /.*\*\/\s*$/.test(line) &&
    line.includes("console.log") &&
    !line.includes("/*")
  ) {
    return false;
  }

  // Verifica el formato básico: debe contener al menos console.log(
  const hasBasicFormat = /console\.log\(/.test(line);

  if (!hasBasicFormat) {
    return false; // No contiene el formato básico
  }

  // Si la línea parece ser una instrucción completa:
  // - Puede terminar con ); (con punto y coma)
  // - Puede terminar con ) (sin punto y coma)
  const isCompleteLineWithSemicolon = /console\.log\(.*\);/.test(line);
  const isCompleteLineWithoutSemicolon =
    /console\.log\(.*\)(?!\w)/.test(line) && !line.includes(");");

  // Si la línea es parte de una instrucción multilinea
  const isMultiLine =
    line.trim().endsWith("\\") || // Línea continuada con backslash
    (/console\.log\(/.test(line) && !line.includes(")")) || // Solo tiene el comienzo
    (/\);/.test(line) && !line.includes("console.log")) || // Solo tiene el final con punto y coma
    (/\)(?!\w)/.test(line) &&
      !line.includes("console.log") &&
      !line.includes(");")); // Solo tiene el final sin punto y coma

  // La línea es correcta si:
  // - Es una línea completa con formato correcto (con o sin punto y coma), o
  // - Es parte de una instrucción multilinea válida
  return (
    isCompleteLineWithSemicolon || isCompleteLineWithoutSemicolon || isMultiLine
  );
}
