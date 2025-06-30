import * as vscode from 'vscode';
import Denque from 'denque';
import { ConsoleData } from './types/consoleData.interface';
import { ConsoleDataMap } from './types/consoleDataMap.interface';
import { MAX_DECORATIONS } from './constants';

export const updateConsoleDataMap = (
  editor: vscode.TextEditor | undefined,
  consoleData: ConsoleData[],
  consoleDataMap: ConsoleDataMap
) => {
  if (!editor) return;

  for (const { message, location } of consoleData) {
    const url = location.url;
    const key = location.line.toString();

    // Ensure a map exists for the file URL
    if (!consoleDataMap.has(url)) {
      consoleDataMap.set(url, new Map());
    }
    const fileMap = consoleDataMap.get(url)!;

    // Ensure a denque exists for the line number
    if (!fileMap.has(key)) {
      fileMap.set(key, new Denque<string>());
    }
    const messageDenque = fileMap.get(key);

    // If the denque is empty, skip it
    if (!messageDenque) continue;

    // Add the new message to the front of the denque
    messageDenque.unshift(message);

    // Limit the denque size to 1000 messages
    if (messageDenque.size() > MAX_DECORATIONS) messageDenque.pop();
  }
};
