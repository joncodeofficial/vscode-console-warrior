import fs from "fs";

export const checkIfNodeModulesReady = async (
  dir: string,
  MAX_TRIES = 20,
  DELAY = 500
): Promise<boolean> => {
  for (let i = 0; i < MAX_TRIES; i++) {
    try {
      const items = fs.readdirSync(dir).filter((name) => !name.startsWith("."));
      if (items.length > 0) return true;
    } catch (e) {
      console.log(e);
    }
    await new Promise((r) => setTimeout(r, DELAY));
  }
  return false;
};
