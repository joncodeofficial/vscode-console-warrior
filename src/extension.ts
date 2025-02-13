import * as vscode from "vscode";
import { injectionCode } from "./services/injection";
import http from "http";
import WebSocket from "ws";
import httpProxy from "http-proxy";
import { chromium } from "playwright";
import { formattedMessage } from "./utils/formattedMessage";
import { detectPortAndGreet } from "./utils/detectPortAndGreet";

let decorationType: vscode.TextEditorDecorationType;

const wss = new WebSocket.Server({ port: 9000 });

declare global {
  var browser: import("playwright").Browser;
  var page: import("playwright").Page;
}

global.browser = global.browser || undefined;
global.page = global.page || undefined;

(async () => {
  global.browser = await chromium.launch({
    headless: true, // Mantener en background
    args: [
      "--no-sandbox", // 🔹 Evita restricciones de sandboxing
      "--disable-setuid-sandbox", // 🔹 Necesario en algunos entornos Linux
      "--disable-gpu", // 🔹 Desactiva la GPU para menos consumo
      "--disable-dev-shm-usage", // 🔹 Usa la memoria RAM en lugar de /dev/shm
      "--disable-software-rasterizer", // 🔹 Mejora el rendimiento en headless
      "--disable-extensions", // 🔹 No carga extensiones innecesarias
      "--disable-background-timer-throttling", // 🔹 Evita que Playwright limite procesos en segundo plano
      "--disable-renderer-backgrounding", // 🔹 Evita pausas en la renderización
      "--disable-backgrounding-occluded-windows", // 🔹 Evita pausas si la ventana no está visible
      "--blink-settings=imagesEnabled=false", // 🔹 No carga imágenes (si no las necesitas)
    ],
  });

  global.page = await global.browser.newPage();
  await page.goto("http://localhost:3000/");

  // Mantener el proceso abierto
  process.stdin.resume();
})();

export function activate(context: vscode.ExtensionContext) {
  // Configurar el proxy HTTP
  const proxy = httpProxy.createProxyServer({});

  var consoleData: string[] = [];

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
      target: "http://localhost:5500",
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

  // Registra el comando de prueba
  let disposable = vscode.commands.registerCommand(
    "console-warrior.testConsole",
    () => {
      detectPortAndGreet(5500);

      // writeToTerminal();

      vscode.window.showInformationMessage(
        "Console Warrior is running in port 5500"
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
  disposable = vscode.workspace.onDidChangeTextDocument(
    async (event: vscode.TextDocumentChangeEvent) => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) {
        return;
      }

      const document = event.document;
      if (document.languageId !== "javascript") {
        return;
      }

      updateDecorations(editor, consoleData);
    }
  );

  vscode.workspace.onDidSaveTextDocument(
    async (document: vscode.TextDocument) => {
      const editor = vscode.window.activeTextEditor;
      if (editor && editor.document === document) {
        await page.reload({ waitUntil: "load" });

        updateDecorations(editor, consoleData);
      }
    }
  );

  context.subscriptions.push(disposable);
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

  console.log(consoleData);

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
        line: parseInt(key.split(":")[0], 10),
        column: parseInt(key.split(":")[1], 10),
        messages: Array.from(messages),
      })),
    })
  );

  console.log(mappedConsoleData);

  for (const row of mappedConsoleData) {
    // const data = JSON.parse(consoleData[i]);
    const file = row.file;

    // Skip if the file path doesn't match the current editor
    if (file && !currentFilePath.endsWith(file)) {
      continue;
    }

    for (const col of row.locations) {
      const startLine = col.line - 1;
      let currentLine = startLine;
      let foundClosing = false;

      while (currentLine < document.lineCount && !foundClosing) {
        const lineText = document.lineAt(currentLine).text;

        if (lineText.includes(");")) {
          foundClosing = true;
          const closingIndex = lineText.lastIndexOf(");") + 2;

          const decoration: vscode.DecorationOptions = {
            range: new vscode.Range(
              new vscode.Position(currentLine, closingIndex),
              new vscode.Position(currentLine, closingIndex)
            ),
            renderOptions: {
              after: {
                contentText: " → " + formattedMessage(col.messages.join(" → ")),
                color: "#73daca",
                textDecoration: "none; white-space: pre;",
              },
            },
          };

          decorations.push(decoration);
        }
        currentLine++;
      }
    }
  }

  editor.setDecorations(decorationType, []);

  // Al final, mostrar todos los decoradores
  editor.setDecorations(decorationType, decorations);
}

// const writeToTerminal = (
//   colorCode = 32,
//   message = "Console Warrior is loading..."
// ) => {
//   let terminal = vscode.window.terminals.find(
//     (t) => t.name === "Console Warrior"
//   );
//   if (!terminal) {
//     terminal = vscode.window.createTerminal("Console Warrior");
//   }
//   terminal.show();

//   terminal.sendText(
//     `echo -e "\\e[${colorCode}m${message}\\e[0m" && echo -e "\\e[1A\\e[1A\\e[2K\\e[1S"`
//   );
// };
