import fs from 'fs';
import path from 'path';
import { sleep } from './sleep';

const MAX_TRIES = 20;
const DELAY = 500;
const STABLE_THRESHOLD_MS = 2000;

// Recursively get the latest mtime of all real subdirs (ignore symlinks)
const getLatestMTime = (dir: string): number => {
  try {
    let latest = fs.statSync(dir).mtimeMs;
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const e of entries) {
      const fullPath = path.join(dir, e.name);

      // Ignore symlinks and dotfiles
      if (e.isSymbolicLink() || e.name.startsWith('.')) continue;

      if (e.isDirectory()) {
        const subMtime = getLatestMTime(fullPath);
        if (subMtime > latest) latest = subMtime;
      } else {
        const fileMtime = fs.statSync(fullPath).mtimeMs;
        if (fileMtime > latest) latest = fileMtime;
      }
    }
    return latest;
  } catch {
    return 0;
  }
};

// Check if node_modules hasn't been modified recently
const isNodeModulesStable = (dir: string) => {
  const latestMtime = getLatestMTime(dir);
  return Date.now() - latestMtime > STABLE_THRESHOLD_MS;
};

// Check if node_modules has the critical dependencies for the project
const hasDependencies = (dir: string, criticalDeps: string[] = ['vite']) => {
  try {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    const availableDeps = new Set(
      entries
        .filter((e) => {
          if (e.name.startsWith('.') || ['.bin', '.cache'].includes(e.name)) return false;
          const fullPath = path.join(dir, e.name);
          try {
            const stats = fs.statSync(fullPath);
            return stats.isDirectory();
          } catch {
            return false;
          }
        })
        .map((e) => e.name)
    );

    // Check if all critical dependencies are present
    return criticalDeps.every((dep) => availableDeps.has(dep));
  } catch {
    return false;
  }
};

// Wait until node_modules exists, is stable, and has enough packages
export const checkIfNodeModulesReady = async (dir: string): Promise<boolean> => {
  for (let i = 0; i < MAX_TRIES; i++) {
    if (fs.existsSync(dir) && isNodeModulesStable(dir) && hasDependencies(dir)) {
      return true;
    }
    await sleep(DELAY);
  }
  return false;
};
