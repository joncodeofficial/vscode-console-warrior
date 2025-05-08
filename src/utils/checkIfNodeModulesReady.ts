import fs from "fs";

export const checkIfNodeModulesReady = async (
  dir: string,
  maxTries = 20,
  delay = 500
): Promise<boolean> => {
  for (let i = 0; i < maxTries; i++) {
    try {
      const items = fs.readdirSync(dir).filter((name) => !name.startsWith("."));
      if (items.length > 0) return true;
    } catch (e) {
      console.log(e);
    }
    await new Promise((r) => setTimeout(r, delay));
  }
  return false;
};
