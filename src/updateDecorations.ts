import * as vscode from "vscode";
import { IConsoleData } from "./types/consoleData.interface";
import { truncateString } from "./utils/truncateString";
import { formatString } from "./utils/formatString";
import { performance } from "perf_hooks";

export const updateDecorations = (
  editor: vscode.TextEditor | undefined,
  consoleData: IConsoleData[],
  decorationType: vscode.TextEditorDecorationType,
  consoleDataMap: Map<string, Map<string, string[]>>
) => {
  if (!editor) return;

  const document = editor.document;
  const decorations: vscode.DecorationOptions[] = [];

  // Get the current file path from the editor
  const currentFilePath = document.uri.fsPath;

  const start = performance.now();

  consoleData.forEach(({ message, location }) => {
    const { url, line, column } = location;
    const key = `${line}:${column}`; // Clave para `line:column`

    if (!consoleDataMap.has(url)) consoleDataMap.set(url, new Map());

    const fileMap = consoleDataMap.get(url)!;

    if (!fileMap.has(key)) fileMap.set(key, []);

    fileMap.get(key)!.push(message);
  });

  for (const [file, innerMap] of consoleDataMap) {
    for (const [position, set] of innerMap) {
      const line = parseInt(position.split(":")[0]);

      const message = Array.from(set).reverse().join(" → ");

      if (file && !currentFilePath.endsWith(file)) continue;

      const startLine = line - 1;
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
                contentText: " → " + truncateString(formatString(message)),
                color: "#73daca",
                textDecoration: "none; white-space: pre; pointer-events: none;",
              },
            },
          };

          decorations.push(decoration);
        }
        currentLine++;
      }
    }
  }
  const end = performance.now();
  console.log(`Duración: ${end - start} ms`);

  editor.setDecorations(decorationType, decorations);
  return decorations;
};
