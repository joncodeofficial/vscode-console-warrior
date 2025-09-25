import * as vscode from 'vscode';

// Determine if a line was added or removed
export const getModifiedLine = (editor: vscode.TextDocumentChangeEvent): number => {
  for (const change of editor.contentChanges) {
    // Line deleted: has content removed and spans multiple lines
    if (
      change.rangeLength > 0 &&
      change.text === '' &&
      change.range.start.line !== change.range.end.line
    ) {
      return change.range.start.line;
    }
    // Line created: no content removed and contains newline
    if (change.rangeLength === 0 && change.text.includes('\n')) return change.range.start.line;
  }
  return -1; // No line changes detected
};
