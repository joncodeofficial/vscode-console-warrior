import * as vscode from 'vscode';
import { connectToMainWS } from '../connectToMainWS';
import { WebSocket } from 'ws';
import { ConsoleData } from '../types/consoleData.interface';

export const commandConnectPort = (
  context: vscode.ExtensionContext,
  socket: WebSocket | null,
  consoleData: ConsoleData[]
) => {
  return vscode.commands.registerCommand('extension.connectToPort', async () => {
    const input = await vscode.window.showInputBox({
      prompt: 'Enter a port (1 - 65535)',
      validateInput: (value) => {
        const num = Number(value);
        if (isNaN(num)) return 'Value must be a number';
        if (!Number.isInteger(num)) return 'Value must be an integer';
        if (num < 1 || num > 65535) return 'Port must be between 1 and 65535';
        return null;
      },
    });

    if (input) {
      if (socket) socket.close();
      const port = Number(input);
      socket = connectToMainWS(port, consoleData);
      context.workspaceState.update('port', port);
      vscode.window.showInformationMessage(`Console Warrior listening on port ${port}`);
    }
  });
};
