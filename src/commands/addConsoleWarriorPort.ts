import * as vscode from 'vscode';
import { connectToMainWS } from '../connectToMainWS';
import { WebSocket } from 'ws';
import { ConsoleData } from '../types/consoleData.interface';

export const addConsoleWarriorPort = (
  context: vscode.ExtensionContext,
  socket: WebSocket | null,
  consoleData: ConsoleData[]
) => {
  return vscode.commands.registerCommand('extension.addPort', async () => {
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
      const num = Number(input);
      context.workspaceState.update('port', num);
      if (socket) socket.close();
      const getPort: number = context.workspaceState.get('port') ?? 0;
      socket = connectToMainWS(getPort, consoleData);
      vscode.window.showInformationMessage(`Console Warrior listening on port ${num}`);
    }
  });
};
