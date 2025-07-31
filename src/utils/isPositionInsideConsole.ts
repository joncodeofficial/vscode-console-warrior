// Checks if the position is within the console functions
export const isPositionInsideConsole = (code: string, position: number) => {
  const logIndex = code.indexOf('console.log(');
  // If there is no console.log() function, then the position is not within the console.log() function
  if (logIndex === -1) return false;

  // Ensure the position is after 'console.log('
  const openParenIndex = code.indexOf('(', logIndex);

  // If there is no open paren, then the position is not within the console.log() function
  if (openParenIndex === -1) return false;

  let depth = 1;
  for (let i = openParenIndex; i < code.length; i++) {
    // If the character is a parenthesis, increment
    if (code[i] === '(') depth++;
    // If the character is a closing parenthesis, decrement
    else if (code[i] === ')') depth--;

    if (i === position && depth > 0) return true; // position is within the parens

    // If depth reaches 0, it means we are outside the console.log() function
    if (depth === 0) break;
  }
  return false;
};
