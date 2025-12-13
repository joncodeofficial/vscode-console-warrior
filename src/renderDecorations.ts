import * as vscode from 'vscode';
import { truncateString, formatString, hasValidConsole, getCurrentThemeColor } from './utils';
import { ConsoleDataMap } from './types';

// Create a decoration type for console log annotations
export const decorationType = vscode.window.createTextEditorDecorationType({
  textDecoration: 'pointer-events: none;',
  rangeBehavior: vscode.DecorationRangeBehavior.ClosedClosed,
});

// Format the counter text
const formatCounterText = (count: number) => (count > 1 ? ` ✕${count} ➜ ` : ' ');

// Render decorations for the current file
export const renderDecorations = (editor: vscode.TextEditor, consoleDataMap: ConsoleDataMap) => {
  const document = editor.document;
  const currentFilePath = document.uri.fsPath.toLowerCase();
  const decorations: vscode.DecorationOptions[] = [];

  // Loop through the console data map and render decorations for each line
  for (const [fileKey, positionsMap] of consoleDataMap) {
    // Extract the workspace and file path from the key (format: "workspace::filename" or just "filename")
    const [workspacePath, filePath] = fileKey.includes('::')
      ? fileKey.split('::')
      : [null, fileKey];

    // Normalize file path for case-insensitive comparison (Windows)
    const normalizedFilePath = filePath.toLowerCase();

    // Check if the current file path matches the file path in the map
    if (!currentFilePath.endsWith(normalizedFilePath)) {
      continue;
    }

    // If we have workspace info, verify the file is in that workspace
    // workspacePath is already normalized (lowercase) from updateConsoleDataMap
    if (workspacePath && !currentFilePath.startsWith(workspacePath)) {
      continue;
    }

    // Loop through the positions map and render decorations for each line
    for (const [position, { consoleMessages, counter, type }] of positionsMap) {
      const line = parseInt(position) - 1;

      // Check if the line number is within the document's line count
      if (line < 0 || line >= document.lineCount) continue;

      const lineText = document.lineAt(line).text;
      if (!hasValidConsole(lineText)) continue;

      const closingIndex = lineText.length + 2;

      // Get the console messages array for the current line
      const consoleMessagesArray = consoleMessages.toArray();
      const themeColor = getCurrentThemeColor(type);

      decorations.push({
        range: new vscode.Range(line, closingIndex, line, closingIndex),
        renderOptions: {
          after: {
            contentText:
              formatCounterText(counter) +
              truncateString(
                formatString(consoleMessagesArray.map((msg) => msg.message).join(' ➜ '))
              ),
            color: themeColor,
          },
        },
      });
    }
  }
  editor.setDecorations(decorationType, decorations);
};
