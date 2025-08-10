import * as vscode from 'vscode';
import Denque from 'denque';
import { ConsoleData, ConsoleDataMap, ConsoleDataMapValue } from './types';
import { MAX_DECORATIONS } from './constants';

export const updateConsoleDataMap = (
  editor: vscode.TextEditor | undefined,
  consoleData: ConsoleData[],
  consoleDataMap: ConsoleDataMap
) => {
  if (!editor) return;

  for (const { message, location, timestamp, type } of consoleData) {
    const url = location.url;
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
      } satisfies ConsoleDataMapValue);
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
