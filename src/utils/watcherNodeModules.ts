import fs from "fs";
import path from "path";
import { checkIfNodeModulesReady } from "./checkIfNodeModulesReady";
import { addConsoleWarriorPlugin } from "../plugins/addConsoleWarriorPlugin";
import * as VSCODE from "vscode";

export const watcherNodeModules = (vscode: typeof VSCODE) => {
  const workspacePath = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
  // If no workspace is open, return
  if (!workspacePath) return;

  const nodeModulesPath = path.join(workspacePath, "node_modules");

  // If already exists, check if it's ready
  if (fs.existsSync(nodeModulesPath)) {
    checkIfNodeModulesReady(nodeModulesPath).then((ready) => {
      if (ready) {
        addConsoleWarriorPlugin(vscode);
        vscode.window.showInformationMessage(
          "Este se ejecuta cuando reload o se inicia el workspace"
        );
      }
    });
    return;
  }

  // Watch for folder creation
  const watcher = vscode.workspace.createFileSystemWatcher(
    new vscode.RelativePattern(workspacePath, "node_modules"),
    false,
    true,
    true
  );

  watcher.onDidCreate(async () => {
    const ready = await checkIfNodeModulesReady(nodeModulesPath);
    if (ready) {
      addConsoleWarriorPlugin(vscode);
      vscode.window.showInformationMessage(
        "Este se ejecuta cuando se crea el node_modules"
      );
    }
    watcher.dispose();
  });

  return watcher;
};
