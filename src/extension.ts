import * as vscode from "vscode";
import { injectionCode } from "./services/injection";
import http, { get } from "http";
import WebSocket from "ws";
import httpProxy from "http-proxy";
import { formattedMessage } from "./utils/formattedMessage";
import { truncateStr } from "./utils/truncateStr";
import { monitorChanges } from "./services/monitoring";
import { UPDATE_RATE } from "./constants";
import { launchBrowser } from "./browser";
import { getFilename } from "./utils/getFilenameFromUrl";
const { SourceMapConsumer } = require("source-map");

let decorationType: vscode.TextEditorDecorationType;

const wss = new WebSocket.Server({ port: 9000 });

const consoleData: string[] = [];

const sourceMapCache = new Map();

declare global {
  var browser: import("playwright").Browser;
  var page: import("playwright").Page;
}

global.browser = global.browser || undefined;
global.page = global.page || undefined;

export function activate(context: vscode.ExtensionContext) {
  // Configurar el proxy HTTP
  const proxy = httpProxy.createProxyServer({});

  // Crear servidor proxy que inyecta el código en respuestas HTML
  const server = http.createServer((req, res: any) => {
    const _write = res.write;
    const _end = res.end;
    const chunks: any = [];

    res.write = function (chunk: any) {
      chunks.push(chunk);
      return true;
    };

    res.end = function (chunk: any) {
      if (chunk) {
        chunks.push(chunk);
      }

      const contentType = res.getHeader("content-type") || "";
      if (contentType.includes("text/html")) {
        const body = Buffer.concat(chunks).toString("utf8");
        const injectedBody = body.replace(
          "</head>",
          `<script>${injectionCode}</script></head>`
        );
        res.removeHeader("content-length");
        _write.call(res, injectedBody);
      } else {
        chunks.forEach((chunk: any) => _write.call(res, chunk));
      }

      _end.call(res);
    };

    // Redirigir peticiones al Live Server que corre en el puerto 5500
    proxy.web(req, res, {
      target: "http://localhost:5173",
    });
  });

  // Enviar mensaje a todos los clientes conectados
  wss.on("connection", (ws) => {
    console.log("Cliente conectado al WebSocket");

    consoleData.length = 0;

    ws.on("message", (message) => {
      try {
        const data = JSON.parse(message as any);
        // Aquí puedes manejar otros tipos de mensajes
        // console.log("[Browser Log]", data.message, data.location);
        consoleData.push(JSON.stringify(data));
        console.log(JSON.stringify(data));
        // updateDecorations(vscode.window.activeTextEditor!, consoleData);
      } catch (e) {
        console.warn("Error parsing WebSocket message", e);
      }
    });
  });

  // Iniciar el servidor proxy en el puerto 3000
  const PROXY_PORT = 3000;
  server.listen(PROXY_PORT, () => {
    console.log(`Proxy running on http://localhost:${PROXY_PORT}`);
    console.log(`WebSocket server running on port 9000`);
  });

  let disposable = vscode.commands.registerCommand(
    "console-warrior.runPort",
    async () => {
      await launchBrowser(global);

      monitorChanges(
        consoleData,
        () => {
          updateDecorations(vscode.window.activeTextEditor!, consoleData);
        },
        UPDATE_RATE
      );

      vscode.window.showInformationMessage(
        "Console Warrior is running in port 5173"
      );
    }
  );

  context.subscriptions.push(disposable);

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
        await global.page.reload({ waitUntil: "load" });
      }
    }
  );

  context.subscriptions.push(changeTextDocument);
}

export function deactivate() {
  if (decorationType) {
    decorationType.dispose();
  }
}

async function updateDecorations(
  editor: vscode.TextEditor,
  consoleData: string[]
) {
  const document = editor.document;
  const decorations: vscode.DecorationOptions[] = [];

  // Get the current file path from the editor
  const currentFilePath = document.uri.fsPath;

  // Map para agrupar por `file`
  const grouped = new Map<string, Map<string, Set<string>>>();

  consoleData.forEach((jsonStr) => {
    const { message, location } = JSON.parse(jsonStr);
    const { file, line, column } = location;
    const key = `${line}:${column}`; // Clave para `line:column`

    if (!grouped.has(file)) {
      grouped.set(file, new Map());
    }

    const fileMap = grouped.get(file)!;

    if (!fileMap.has(key)) {
      fileMap.set(key, new Set());
    }

    fileMap.get(key)!.add(message);
  });

  // Convertimos el `Map` a un objeto estructurado para facilitar su uso
  const mappedConsoleData = Array.from(grouped.entries()).map(
    ([file, locations]) => ({
      file,
      locations: Array.from(locations.entries()).map(([key, messages]) => ({
        line: parseInt(key.split(":")[0]),
        column: parseInt(key.split(":")[1]),
        messages: Array.from(messages),
      })),
    })
  );

  // console.log(mappedConsoleData);

  for (const row of mappedConsoleData) {
    const file = row.file;

    if (file && !currentFilePath.endsWith(file)) {
      continue;
    }

    for (const col of row.locations) {
      const startLine = col.line - 1;
      let currentLine = startLine;
      let foundClosing = false;

      while (currentLine < document.lineCount && !foundClosing) {
        const lineText = document.lineAt(currentLine).text;

        // Check for both ); and ) endings
        if (lineText.includes(");") || lineText.includes(")")) {
          foundClosing = true;
          // Find the last occurrence of either ); or )
          const closingIndex = Math.max(
            lineText.lastIndexOf(");") + 2,
            lineText.lastIndexOf(")") + 1
          );

          const decoration: vscode.DecorationOptions = {
            range: new vscode.Range(
              new vscode.Position(currentLine, closingIndex),
              new vscode.Position(currentLine, closingIndex)
            ),
            renderOptions: {
              after: {
                contentText:
                  " → " +
                  truncateStr(
                    formattedMessage(col.messages.reverse().join(" → "))
                  ),
                color: "#73daca",
                textDecoration: "none; white-space: pre; pointer-events: none;",
              },
            },
            hoverMessage: new vscode.MarkdownString(col.messages.join(" → ")),
          };

          decorations.push(decoration);
        }
        currentLine++;
      }
    }
  }

  editor.setDecorations(decorationType, decorations);
}
