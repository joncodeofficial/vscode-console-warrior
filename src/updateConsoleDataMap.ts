import * as vscode from "vscode";
import { IConsoleData } from "./types/consoleData.interface";
import { IConsoleDataMap } from "./types/consoleDataMap.interface";

// Function to update the console data map
export const updateConsoleDataMap = (
  editor: vscode.TextEditor | undefined,
  consoleData: IConsoleData[],
  consoleDataMap: IConsoleDataMap
) => {
  if (!editor) return;

  consoleData.forEach(({ message, location }) => {
    const { url, line } = location;
    const key = `${line}`;
    if (!consoleDataMap.has(url)) consoleDataMap.set(url, new Map());

    const fileMap = consoleDataMap.get(url)!;

    if (!fileMap.has(key)) fileMap.set(key, []);

    fileMap.get(key)!.push(message);
  });
};
