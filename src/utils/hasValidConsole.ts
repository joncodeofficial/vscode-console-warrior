// Regular expression to match console statements, ignoring commented lines
const CONSOLE_COMMENTS_REGEX =
  /(?:^\s*(?:\/\/|\/\*|\*).*console\.|.*console\..*\*\/|console\.(?:log|warn|error|table|info|debug)\()/;

// Checks if the line contains a console method call
export const hasValidConsole = (line: string): boolean => {
  const match = CONSOLE_COMMENTS_REGEX.exec(line);
  if (!match) return false;

  const matchedText = match[0];

  // if it contains console.<method>( and is not commented out
  if (matchedText.includes('console.') && matchedText.includes('(')) {
    // Verify that the console method is not commented out
    return !(
      matchedText.startsWith('//') ||
      matchedText.startsWith('/*') ||
      matchedText.startsWith('*') ||
      matchedText.includes('*/')
    );
  }
  return false;
};
