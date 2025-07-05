import * as VSCODE from 'vscode';
import path from 'path';
import fs from 'fs';
import { checkIfNodeModulesReady } from './utils';
import { vitePlugin } from './plugins/vitePlugin';

// This function activates the Vite plugin for a given node_modules path
const activatePlugin = async (vscode: typeof VSCODE, nodeModulesPath: string) => {
  const ready = await checkIfNodeModulesReady(nodeModulesPath);
  if (ready) {
    vitePlugin(vscode, nodeModulesPath);
  }
};

// Scan for existing node_modules
const scanExisting = (vscode: typeof VSCODE, dir: string) => {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    // If the entry is a directory, check if it's node_modules
    if (entry.isDirectory()) {
      if (entry.name === 'node_modules') {
        activatePlugin(vscode, fullPath);
      } else {
        scanExisting(vscode, fullPath);
      }
    }
  }
};

// This function sets up a file system watcher for the node_modules directory
export const watcherNodeModules = (vscode: typeof VSCODE) => {
  // Check if there is an open workspace
  const workspacePath = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
  if (!workspacePath) return;

  // Scan existing node_modules directories at startup
  scanExisting(vscode, workspacePath);

  // Watch for creation and deletion of node_modules
  const watcher = vscode.workspace.createFileSystemWatcher(
    new vscode.RelativePattern(workspacePath, '**/node_modules'),
    false, // watch create
    true, // ignore change
    false // watch delete
  );

  watcher.onDidCreate(() => {
    scanExisting(vscode, workspacePath);
  });

  watcher.onDidDelete(() => {
    console.log('node_modules directory was deleted');
  });

  return watcher;
};
