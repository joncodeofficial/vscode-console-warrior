import { ConsoleDataMap } from './types';
import * as vscode from 'vscode';
import { hasValidConsole, hasPositionInsideConsole, getModifiedLine } from './utils';

// Remove commented consoles
export const removeDecorations = (
  editor: vscode.TextDocumentChangeEvent,
  consoleDataMap: ConsoleDataMap
) => {
  // Get the file path of the current editor
  const filePath = editor.document.uri.fsPath;
  const modifiedLine = getModifiedLine(editor);

  for (const [fileKey, positionsMap] of consoleDataMap) {
    // Extract the actual file path from the key (format: "workspace::filename" or just "filename")
    const file = fileKey.includes('::') ? fileKey.split('::')[1] : fileKey;

    if (filePath.endsWith(file)) {
      for (const [position, { type }] of positionsMap) {
        const line = parseInt(position) - 1;
        const lineText = editor.document.lineAt(line).text;

        // if line changed (deleted or created) and is after the changed line, delete
        if (modifiedLine !== -1 && line >= modifiedLine) {
          positionsMap.delete(position);
          continue;
        }

        // if console.log is commented, delete
        if (!hasValidConsole(lineText) && positionsMap.has(position)) {
          positionsMap.delete(position);
          continue;
        }

        const change = editor.contentChanges.find((change) => change.range.start.line === line);
        // if no considence change, continue
        if (!change) continue;

        const start = change.range.start.character;
        // if change inside of the console.log, delete
        if (hasPositionInsideConsole(lineText, start, type)) positionsMap.delete(position);
      }
      if (positionsMap.size === 0) consoleDataMap.delete(fileKey);
    }
  }
};
