import * as vscode from 'vscode';
import Denque from 'denque';
import { ConsoleData, ConsoleDataMap, ConsoleDataMapValues } from './types';
import { MAX_DECORATIONS } from './constants';

export const updateConsoleDataMap = (
  editor: vscode.TextEditor,
  consoleData: ConsoleData[],
  consoleDataMap: ConsoleDataMap
) => {
  const editorFilePath = editor.document.uri.fsPath;

  for (const { message, location, timestamp, type, workspacePath } of consoleData) {
    // Filter: only process messages from the same workspace as the editor file
    if (workspacePath && !editorFilePath.startsWith(workspacePath)) {
      continue;
    }

    // Create unique key: workspace + file URL to prevent collisions between projects
    const url = workspacePath ? `${workspacePath}::${location.url}` : location.url;
    const key = location.line.toString();

    // Ensure a map exists for the file URL
    if (!consoleDataMap.has(url)) consoleDataMap.set(url, new Map());

    const fileMap = consoleDataMap.get(url)!;

    // Ensure a denque exists for the line number
    if (!fileMap.has(key)) {
      fileMap.set(key, {
        type,
        counter: 1,
        consoleMessages: new Denque([{ message, timestamp }]),
      } satisfies ConsoleDataMapValues);
      continue;
    }

    const messageDenque = fileMap.get(key);
    // Check if one message is already in the denque
    if (!messageDenque) continue;
    // Add the new message to the front of the denque
    messageDenque.counter++;
    messageDenque.consoleMessages.unshift({ message, timestamp });
    // Limit the denque size to MAX_DECORATIONS
    if (messageDenque.consoleMessages.size() > MAX_DECORATIONS) {
      messageDenque.consoleMessages.pop();
    }
  }
};
