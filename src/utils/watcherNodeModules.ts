import fs from "fs";
import path from "path";
import { checkIfNodeModulesReady } from "./checkIfNodeModulesReady";
import { consoleWarriorPlugin } from "../plugins/consoleWarriorPlugin";
import * as VSCODE from "vscode";

export const watcherNodeModules = (vscode: typeof VSCODE) => {
  const workspacePath = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
  if (!workspacePath) return;

  const nodeModulesPath = path.join(workspacePath, "node_modules");

  const activatePlugin = async () => {
    const ready = await checkIfNodeModulesReady(nodeModulesPath);
    if (ready) {
      consoleWarriorPlugin(vscode);
    }
  };

  // Si ya existe node_modules al iniciar
  if (fs.existsSync(nodeModulesPath)) {
    activatePlugin();
  }

  // Watch for creación y eliminación de node_modules
  const watcher = vscode.workspace.createFileSystemWatcher(
    new vscode.RelativePattern(workspacePath, "node_modules"),
    false, // watch create
    true, // ignore change
    false // watch delete
  );

  watcher.onDidCreate(() => {
    vscode.window.showInformationMessage("node_modules creado");
    activatePlugin();
  });

  watcher.onDidDelete(() => {
    vscode.window.showInformationMessage("node_modules eliminado");
    // Aquí podrías desactivar tu plugin si es necesario
  });

  return watcher;
};
