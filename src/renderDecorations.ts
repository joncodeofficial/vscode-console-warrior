import * as vscode from 'vscode';
import {
  truncateString,
  formatString,
  hasValidConsole,
  formatLocalTimestamp,
  getCurrentThemeColor,
} from './utils';
import { ConsoleDataMap, ConsoleMessage, ConsoleDataMapValues } from './types';

// Create a decoration type for console log annotations
export const decorationType = vscode.window.createTextEditorDecorationType({
  textDecoration: 'pointer-events: none;',
  rangeBehavior: vscode.DecorationRangeBehavior.ClosedClosed,
});

// Create a markdown string for the hover message
const createHoverMessage = (
  messages: ConsoleMessage[],
  type: ConsoleDataMapValues['type'],
  counter: number
): vscode.MarkdownString => {
  const markdown = new vscode.MarkdownString();
  markdown.isTrusted = true;
  markdown.supportHtml = true;
  markdown.supportThemeIcons = true;

  // Build all the content in a single string (faster)
  let content = '';
  messages.forEach(({ message, timestamp }, i) => {
    const localTime = formatLocalTimestamp(timestamp);
    content += `<small><span style="color:#f4b35a;">#${counter - i} → ${localTime} • ${type}</span></small>\n\n`;
    content += '```javascript\n' + message + '\n```\n\n';
  });

  markdown.appendMarkdown(content);
  markdown.appendMarkdown(`*🧠 Keep slicing logs, warrior.*`);
  markdown.appendMarkdown(`${'&nbsp;'.repeat(100)}\n`);

  return markdown;
};

// Format the counter text
const formatCounterText = (count: number) => (count > 1 ? ` ✕${count} ➜ ` : ' ');

// Hover provider function for on-demand hover creation
export const createHoverProvider = (getConsoleDataMap: () => ConsoleDataMap) => ({
  provideHover(
    document: vscode.TextDocument,
    position: vscode.Position
  ): vscode.ProviderResult<vscode.Hover> {
    const currentFilePath = document.uri.fsPath;
    const consoleDataMap = getConsoleDataMap();

    for (const [filePath, positionsMap] of consoleDataMap) {
      if (!currentFilePath.endsWith(filePath)) continue;

      const lineKey = String(position.line + 1);
      const data = positionsMap.get(lineKey);

      if (data) {
        const { consoleMessages, type, counter } = data;
        const messages = consoleMessages.toArray();
        const hoverMessage = createHoverMessage(messages, type, counter);
        return new vscode.Hover(hoverMessage);
      }
    }
    return null;
  },
});

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
      if (!hasValidConsole(lineText)) continue;

      const closingIndex = lineText.length + 2;

      // Get the console messages array for the current line
      const consoleMessagesArray = consoleMessages.toArray();
      const themeColor = getCurrentThemeColor(type);

      decorations.push({
        range: new vscode.Range(line, closingIndex, line, closingIndex),
        renderOptions: {
          after: {
            contentText:
              formatCounterText(counter) +
              truncateString(
                formatString(consoleMessagesArray.map((msg) => msg.message).join(' ➜ '))
              ),
            color: themeColor,
          },
        },
      });
    }
  }
  editor.setDecorations(decorationType, decorations);
};
