import * as vscode from "vscode";
import { truncateString } from "./utils/truncateString";
import { formatString } from "./utils/formatString";

// Function to render decorations in the editor
export const renderDecorations = (
  editor: vscode.TextEditor | undefined,
  decorationType: vscode.TextEditorDecorationType,
  consoleDataMap: Map<string, Map<string, string[]>>
) => {
  if (!editor) return;

  const decorations: vscode.DecorationOptions[] = [];

  // Check if the editor is valid
  const document = editor.document;
  // Get the current file path from the editor
  const currentFilePath = document.uri.fsPath;

  for (const [file, innerMap] of consoleDataMap) {
    for (const [position, values] of innerMap) {
      const line = parseInt(position);

      const message = Array.from(values).reverse().join(" → ");

      if (file && !currentFilePath.endsWith(file)) continue;

      const startLine = line - 1;
      let currentLine = startLine;
      let foundClosing = false;

      while (currentLine < document.lineCount && !foundClosing) {
        const lineText = document.lineAt(currentLine).text;

        // Check for both ); and ) endings
        if (lineText.includes("console.log(")) {
          foundClosing = true;

          const closingIndex = lineText.length + 2;

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
  editor.setDecorations(decorationType, decorations);
};
