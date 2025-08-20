export const hasValidConsoleUsage = (line: string): boolean => {
  const consoleMethods = '(log|warn|error|table|info|trace|timeEnd)';
  const consoleRegex = new RegExp(`console\\.${consoleMethods}\\(`);

  // If it doesn't contain console.<method>(, it's invalid
  if (!consoleRegex.test(line)) {
    return false;
  }

  // If it's inside any type of comment, it's invalid
  const commentPatterns = [
    /^\s*\/\/.*console\./, // Line comment: // ... console.
    /^\s*\/\*.*console\..*\*\//, // Single-line block comment: /* ... console. ... */
    /^\s*\/\*.*console\./, // Multi-line comment start: /* ... console.
    /^\s*\*.*console\./, // Inside multi-line comment: * ... console.
    /.*console\..*\*\//, // Multi-line comment end: ... console. ... */
  ];

  return !commentPatterns.some((pattern) => pattern.test(line));
};
