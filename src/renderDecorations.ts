import * as vscode from 'vscode';
import { truncateString, formatString, isConsoleCorrect } from './utils';
import { ConsoleDataMap, ConsoleMessage, ConsoleDataMapValues } from './types';
import { DECORATOR_COLORS } from './constants';

// Create a decoration type for console log annotations
export const decorationType = vscode.window.createTextEditorDecorationType({
  textDecoration: 'pointer-events: none;',
  rangeBehavior: vscode.DecorationRangeBehavior.ClosedClosed,
});

// Get the current theme color
const getCurrentThemeColor = (type: ConsoleDataMapValues['type']) => {
  switch (vscode.window.activeColorTheme.kind) {
    case vscode.ColorThemeKind.Light:
      return DECORATOR_COLORS.light[type];
    case vscode.ColorThemeKind.Dark:
      return DECORATOR_COLORS.dark[type];
  }
};

// Format the counter text
const formatCounterText = (count: number) => (count > 1 ? ` ✕${count} ➜ ` : ' ');

// Format the local timestamp
const formatLocalTimestamp = (timestamp: string) => {
  const digits = '2-digit';
  const date = new Date(timestamp);
  if (isNaN(date.getTime())) return '00:00:00.000';
  return date.toLocaleTimeString(undefined, {
    hour12: false,
    hour: digits,
    minute: digits,
    second: digits,
    fractionalSecondDigits: 3,
  });
};

// Create a markdown string for the hover message
const createHoverMessage = (
  messages: ConsoleMessage[],
  type: ConsoleDataMapValues['type']
): vscode.MarkdownString => {
  const markdown = new vscode.MarkdownString();
  const label = `**⚔️ Console Warrior ${type.toUpperCase()} • ${messages.length} ${messages.length === 1 ? 'Input' : 'Inputs'}**${'&nbsp;'.repeat(50)}`;

  markdown.appendMarkdown(label);
  markdown.appendCodeblock(
    messages
      .map(({ message, timestamp }, i) => {
        const localTime = formatLocalTimestamp(timestamp);
        return `${messages.length - i} → [${localTime}] \n${message}`;
      })
      .join('\n\n'),
    'javascript'
  );
  markdown.appendMarkdown(`\n*🧠 Keep slicing logs, warrior.*`);
  markdown.isTrusted = true;

  return markdown;
};

// Render decorations for the current file
export const renderDecorations = (editor: vscode.TextEditor, consoleDataMap: ConsoleDataMap) => {
  const document = editor.document;
  const currentFilePath = document.uri.fsPath;
  const decorations: vscode.DecorationOptions[] = [];

  // Loop through the console data map and render decorations for each line
  for (const [filePath, positionsMap] of consoleDataMap) {
    // Check if the current file path matches the file path in the map
    if (!currentFilePath.endsWith(filePath)) continue;

    // Loop through the positions map and render decorations for each line
    for (const [position, { consoleMessages, counter, type }] of positionsMap) {
      const line = parseInt(position) - 1;
      // Check if the line number is within the document's line count
      if (line < 0 || line >= document.lineCount) continue;

      const lineText = document.lineAt(line).text;

      if (!isConsoleCorrect(lineText)) continue;
      const closingIndex = lineText.length + 2;

      // Get the console messages array for the current line
      const consoleMessagesArray = consoleMessages.toArray();

      const hoverMessage = createHoverMessage(consoleMessagesArray, type);

      const themeColor = getCurrentThemeColor(type);

      decorations.push({
        range: new vscode.Range(line, closingIndex, line, closingIndex),
        renderOptions: {
          after: {
            contentText:
              formatCounterText(counter) +
              truncateString(
                formatString(consoleMessagesArray.map((mgs) => mgs.message).join(' ➜ '))
              ),
            color: themeColor,
          },
        },
        hoverMessage,
      });
    }
  }

  editor.setDecorations(decorationType, decorations);
};
