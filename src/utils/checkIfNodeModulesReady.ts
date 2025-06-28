import fs from 'fs';
import { DELAY, MAX_TRIES } from '../constants';

export const checkIfNodeModulesReady = async (dir: string): Promise<boolean> => {
  for (let i = 0; i < MAX_TRIES; i++) {
    try {
      const folders = fs.readdirSync(dir).filter((name) => !name.startsWith('.'));
      if (folders.length > 0) return true;
    } catch (_) {
      console.log('Error checking node_modules folder!');
    }
    await new Promise((r) => setTimeout(r, DELAY));
  }
  return false;
};
