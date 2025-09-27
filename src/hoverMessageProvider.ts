import * as vscode from 'vscode';
import { ConsoleDataMap, ConsoleDataMapValues, ConsoleMessage } from './types';
import { formatLocalTimestamp } from './utils';

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
  markdown.appendMarkdown(`${'&nbsp;'.repeat(100)}\n`);
  return markdown;
};

// Hover provider function for on-demand hover creation
export const hoverMessageProvider = (getConsoleDataMap: () => ConsoleDataMap) => ({
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
