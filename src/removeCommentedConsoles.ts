import { ConsoleDataMap } from './types';
import * as vscode from 'vscode';
import { isConsoleLogCorrect } from './utils';

export const removeCommentedConsoles = (
  editor: vscode.TextDocumentChangeEvent,
  consoleDataMap: ConsoleDataMap
) => {
  const filePath = editor.document.uri.fsPath;

  for (const [file, innerMap] of consoleDataMap) {
    if (filePath.endsWith(file)) {
      for (const [key] of innerMap) {
        const lineText = editor.document.lineAt(parseInt(key) - 1).text;

        if (!isConsoleLogCorrect(lineText) && innerMap.has(key)) {
          innerMap.delete(key);
        }
      }
      if (innerMap.size === 0) consoleDataMap.delete(file);
    }
  }
};
