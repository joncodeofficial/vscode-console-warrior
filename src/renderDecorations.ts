import * as vscode from "vscode";
import { truncateString } from "./utils/truncateString";
import { formatString } from "./utils/formatString";
import { isConsoleLogCorrect } from "./utils/isConsoleLogCorrect";

export const renderDecorations = (
  editor: vscode.TextEditor | undefined,
  decorationType: vscode.TextEditorDecorationType,
  consoleDataMap: Map<string, Map<string, string[]>>
) => {
  if (!editor) return;

  const document = editor.document;
  const currentFilePath = document.uri.fsPath;
  const decorations: vscode.DecorationOptions[] = [];

  for (const [file, innerMap] of consoleDataMap) {
    if (!currentFilePath.endsWith(file)) continue;

    for (const [position, values] of innerMap) {
      const line = parseInt(position) - 1;
      if (line < 0 || line >= document.lineCount) continue;

      const lineText = document.lineAt(line).text;
      if (!lineText.includes("console.log(") || !isConsoleLogCorrect(lineText))
        continue;

      const closingIndex = lineText.length + 2;
      decorations.push({
        range: new vscode.Range(line, closingIndex, line, closingIndex),
        renderOptions: {
          after: {
            contentText:
              " ➜ " + truncateString(formatString(values.slice().join(" ➜ "))),
            color: "#73daca",
          },
        },
      });
    }
  }

  editor.setDecorations(decorationType, decorations);
};
