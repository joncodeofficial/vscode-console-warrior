import fs from 'fs';
import { sleep } from './sleep';

const MAX_TRIES = 20;
const DELAY = 500;
const STABLE_THRESHOLD_MS = 2000;

// Check if node_modules hasn't been modified recently
const isNodeModulesStable = (dir: string) => {
  try {
    const stats = fs.statSync(dir);
    const now = Date.now();
    return now - stats.mtimeMs > STABLE_THRESHOLD_MS;
  } catch {
    return false;
  }
};

// Check if node_modules has at least a few installed dependencies
const hasEnoughDependencies = (dir: string) => {
  try {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    const folders = entries.filter(
      (e) => e.isDirectory() && !e.name.startsWith('.') && !['.bin', '.cache'].includes(e.name)
    );
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
