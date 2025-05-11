import fs from "fs";
import path from "path";
import { checkIfNodeModulesReady } from "./checkIfNodeModulesReady";
import { consoleWarriorPlugin } from "../plugins/consoleWarriorPlugin";
import * as VSCODE from "vscode";

export const watcherNodeModules = (vscode: typeof VSCODE) => {
  const workspacePath = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
  if (!workspacePath) return;

  const activatedPaths = new Set<string>();

  const nodeModulesPath = path.join(workspacePath, "node_modules");

  const activatePlugin = async (nodeModulesPath: string) => {
    const ready = await checkIfNodeModulesReady(nodeModulesPath);
    if (ready) {
      consoleWarriorPlugin(vscode, nodeModulesPath);
      vscode.window.showInformationMessage(`Activado en: ${nodeModulesPath}`);
      console.log(`Activado en: ${nodeModulesPath}`);
      activatedPaths.add(nodeModulesPath);
    }
  };

  // Escanea al inicio por si ya existen
  const scanExisting = (dir: string) => {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        if (entry.name === "node_modules") {
          activatePlugin(fullPath);
        } else {
          scanExisting(fullPath); // recursivo
        }
      }
    }
  };

  scanExisting(workspacePath);

  // Si ya existe node_modules al iniciar
  if (fs.existsSync(nodeModulesPath)) {
    activatePlugin(nodeModulesPath);
  }

  // Watch for creación y eliminación de node_modules
  const watcher = vscode.workspace.createFileSystemWatcher(
    new vscode.RelativePattern(workspacePath, "**/node_modules"),
    false, // watch create
    true, // ignore change
    false // watch delete
  );

  watcher.onDidCreate(() => {
    vscode.window.showInformationMessage("node_modules creado");
    activatePlugin(nodeModulesPath);
  });

  watcher.onDidDelete(() => {
    vscode.window.showInformationMessage("node_modules eliminado");
    // Aquí podrías desactivar tu plugin si es necesario
  });

  return watcher;
};
