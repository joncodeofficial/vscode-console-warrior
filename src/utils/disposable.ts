import * as vscode from 'vscode';

export const disposable = (fn: () => void): vscode.Disposable => {
  return { dispose: fn };
};
