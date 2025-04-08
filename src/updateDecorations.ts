import * as vscode from "vscode";
import { IConsoleData } from "./types/consoleData.interface";
import { truncateString } from "./utils/truncateString";
import { formatString } from "./utils/formatString";

export const updateDecorations = (
  editor: vscode.TextEditor | undefined,
  consoleData: IConsoleData[],
  decorationType: vscode.TextEditorDecorationType
) => {
  if (!editor) return;

  const document = editor.document;
  const decorations: vscode.DecorationOptions[] = [];

  // Get the current file path from the editor
  const currentFilePath = document.uri.fsPath;

  // Map para agrupar por `file`
  const grouped = new Map<string, Map<string, Set<string>>>();

  consoleData.forEach(({ message, location }) => {
    const { url: file, line, column } = location;
    const key = `${line}:${column}`; // Clave para `line:column`

    if (!grouped.has(file)) grouped.set(file, new Map());

    const fileMap = grouped.get(file)!;

    if (!fileMap.has(key)) fileMap.set(key, new Set());

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
                  truncateString(
                    formatString(col.messages.reverse().join(" → "))
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
  return decorations;
};
