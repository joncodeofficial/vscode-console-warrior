import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Detects all folders in the workspace that might have Vite projects
 * Checks for:
 * 1. vite.config.* files
 * 2. package.json with "vite" dependency
 * 3. package.json with "dev" script containing "vite"
 * Returns an array of absolute paths to folders
 */
export async function detectViteProjects(): Promise<string[]> {
  const workspaceFolders = vscode.workspace.workspaceFolders;
  if (!workspaceFolders) return [];

  const viteProjectPaths: string[] = [];

  for (const folder of workspaceFolders) {
    const projects = await findViteProjectsInFolder(folder.uri.fsPath);
    viteProjectPaths.push(...projects);
  }

  // Remove duplicates
  return [...new Set(viteProjectPaths)];
}

/**
 * Recursively finds folders with Vite projects
 */
async function findViteProjectsInFolder(folderPath: string): Promise<string[]> {
  const projectPaths: string[] = [];

  try {
    const entries = fs.readdirSync(folderPath, { withFileTypes: true });

    for (const entry of entries) {
      // Skip node_modules and hidden folders
      if (entry.name === 'node_modules' || entry.name.startsWith('.')) {
        continue;
      }

      const fullPath = path.join(folderPath, entry.name);

      if (entry.isDirectory()) {
        // Check if this directory is a Vite project
        if (isViteProject(fullPath)) {
          projectPaths.push(fullPath);
        }

        // Recursively search subdirectories (limit depth to avoid performance issues)
        const depth = fullPath.split(path.sep).length - folderPath.split(path.sep).length;
        if (depth < 3) {
          const subProjects = await findViteProjectsInFolder(fullPath);
          projectPaths.push(...subProjects);
        }
      }
    }
  } catch (error) {
    console.error(`Error scanning folder ${folderPath}:`, error);
  }

  return projectPaths;
}

/**
 * Checks if a folder is a Vite project by multiple criteria
 */
function isViteProject(folderPath: string): boolean {
  // 1. Check for vite.config files
  const hasViteConfig =
    fs.existsSync(path.join(folderPath, 'vite.config.js')) ||
    fs.existsSync(path.join(folderPath, 'vite.config.ts')) ||
    fs.existsSync(path.join(folderPath, 'vite.config.mjs')) ||
    fs.existsSync(path.join(folderPath, 'vite.config.mts'));

  if (hasViteConfig) return true;

  // 2. Check package.json for Vite
  const packageJsonPath = path.join(folderPath, 'package.json');
  if (!fs.existsSync(packageJsonPath)) return false;

  try {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));

    // Check if "vite" is in dependencies or devDependencies
    const hasViteDependency = packageJson.dependencies?.vite || packageJson.devDependencies?.vite;

    if (hasViteDependency) return true;

    // Check if any script uses "vite"
    const scripts = packageJson.scripts || {};
    const hasViteScript = Object.values(scripts).some(
      (script) => typeof script === 'string' && script.includes('vite')
    );

    if (hasViteScript) return true;
  } catch {
    // If package.json is malformed, skip
    return false;
  }

  return false;
}
