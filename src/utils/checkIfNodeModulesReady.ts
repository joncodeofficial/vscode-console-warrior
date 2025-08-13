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

// Check if node_modules has at least a few installed dependencies (ignore symlinks)
const hasEnoughDependencies = (dir: string) => {
  try {
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    const folders = entries.filter((e) => {
      if (e.name.startsWith('.') || ['.bin', '.cache'].includes(e.name)) return false;

      const fullPath = path.join(dir, e.name);
      try {
        // Count like valid folder if it's a real directory or a symlink that points to a directory
        const stats = fs.statSync(fullPath);
        return stats.isDirectory();
      } catch {
        return false;
      }
    });

    return folders.length >= 3;
  } catch {
    return false;
  }
};

// Wait until node_modules exists, is stable, and has enough packages
export const checkIfNodeModulesReady = async (dir: string): Promise<boolean> => {
  for (let i = 0; i < MAX_TRIES; i++) {
    if (fs.existsSync(dir) && isNodeModulesStable(dir) && hasEnoughDependencies(dir)) {
      return true;
    }
    await sleep(DELAY);
  }
  return false;
};
