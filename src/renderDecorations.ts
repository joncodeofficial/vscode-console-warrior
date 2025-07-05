import * as vscode from 'vscode';
import { truncateString, formatString, isConsoleLogCorrect } from './utils';
import { ConsoleDataMap } from './types';

// Create a decoration type for console log annotations
export const decorationType = vscode.window.createTextEditorDecorationType({
  textDecoration: 'pointer-events: none;', // Prevent interaction with decoration
  rangeBehavior: vscode.DecorationRangeBehavior.ClosedClosed, // Decoration stays with text range
});

// Get the current theme color
const getCurrentThemeColor = () => {
  switch (vscode.window.activeColorTheme.kind) {
    case vscode.ColorThemeKind.Light:
      return '#005f5f';
    case vscode.ColorThemeKind.Dark:
      return '#73daca';
    default:
      return '#73daca'; // fallback
  }
};

// Format the counter text
const formatCounterText = (count: number) => (count > 1 ? ` ✕${count} ➜ ` : ' ');

// Render decorations for the current file
export const renderDecorations = (
  editor: vscode.TextEditor | undefined,
  consoleDataMap: ConsoleDataMap
) => {
  if (!editor) return;

  const document = editor.document;
  const currentFilePath = document.uri.fsPath;
  const decorations: vscode.DecorationOptions[] = [];
  const themeColor = getCurrentThemeColor();

  // Loop through the console data map and render decorations for each line
  for (const [filePath, positionsMap] of consoleDataMap) {
    // Check if the current file path matches the file path in the map
    if (!currentFilePath.endsWith(filePath)) continue;

    // Loop through the positions map and render decorations for each line
    for (const [position, { consoleMessages, counter }] of positionsMap) {
      const line = parseInt(position) - 1;
      // Check if the line number is within the document's line count
      if (line < 0 || line >= document.lineCount) continue;

      const lineText = document.lineAt(line).text;
      if (!isConsoleLogCorrect(lineText)) continue;
      const closingIndex = lineText.length + 2;

      decorations.push({
        range: new vscode.Range(line, closingIndex, line, closingIndex),
        renderOptions: {
          after: {
            contentText:
              formatCounterText(counter) +
              truncateString(formatString(consoleMessages.toArray().join(' ➜ '))),
            color: themeColor,
          },
        },
      });
    }
  }

  editor.setDecorations(decorationType, decorations);
};
