// Check if the position is within the console.log() function
export const isInsideConsoleLog = (code: string, position: number) => {
  const logIndex = code.indexOf('console.log(');
  if (logIndex === -1) return false;

  const openParenIndex = code.indexOf('(', logIndex);
  if (openParenIndex === -1) return false;

  let depth = 1;
  for (let i = openParenIndex; i < code.length; i++) {
    const char = code[i];
    if (char === '(') depth++;
    else if (char === ')') depth--;

    if (i === position && depth > 0) {
      return true; // position is within the parens
    }
    if (depth === 0) break;
  }
  return false;
};
