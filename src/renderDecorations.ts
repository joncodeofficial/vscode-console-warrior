import * as vscode from 'vscode';
import { truncateString, formatString, isConsoleCorrect } from './utils';
import { ConsoleDataMap, ConsoleMessagesType, ConsoleDataMapValue } from './types';
import { DECORATOR_COLORS } from './constants';

// Create a decoration type for console log annotations
export const decorationType = vscode.window.createTextEditorDecorationType({
  textDecoration: 'pointer-events: none;', // Prevent interaction with decoration
  rangeBehavior: vscode.DecorationRangeBehavior.ClosedClosed, // Decoration stays with text range
});

// Get the current theme color
const getCurrentThemeColor = (type: ConsoleDataMapValue['type']) => {
  switch (vscode.window.activeColorTheme.kind) {
    case vscode.ColorThemeKind.Light:
      return DECORATOR_COLORS.light[type];
    case vscode.ColorThemeKind.Dark:
      return DECORATOR_COLORS.dark[type];
  }
};

// Format the counter text
const formatCounterText = (count: number) => (count > 1 ? ` ✕${count} ➜ ` : ' ');

// Create a markdown string for the hover message
const createHoverMessage = (
  messages: ConsoleMessagesType[],
  type: ConsoleDataMapValue['type']
): vscode.MarkdownString => {
  const markdown = new vscode.MarkdownString();
  const label = `**⚔️ Console Warrior ${type.toUpperCase()} • ${messages.length} ${messages.length === 1 ? 'Input' : 'Inputs'} UTC**
`;

  markdown.appendMarkdown(label);
  markdown.appendCodeblock(
    messages
      .map(
        ({ message, timestamp }, i) =>
          `${messages.length - i} → [${timestamp.slice(11, 23)}] \n ${message}`
      )
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
