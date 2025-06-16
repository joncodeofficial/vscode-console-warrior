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
    const { url, line } = location;
    const lineKey = line.toString();

    // Ensure a map exists for the file URL
    if (!consoleDataMap.has(url)) {
      consoleDataMap.set(url, new Map());
    }
    const fileMap = consoleDataMap.get(url)!;

    // Ensure a queue exists for the line number
    if (!fileMap.has(lineKey)) {
      fileMap.set(lineKey, new Denque<string>());
    }
    const messageQueue = fileMap.get(lineKey)!;

    // Add the new message to the front of the queue
    messageQueue.unshift(message);

    // Limit the queue size to 1000 messages
    if (messageQueue.size() > MAX_DECORATIONS) messageQueue.pop();
  }
};
