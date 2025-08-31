import * as assert from 'assert';
import * as vscode from 'vscode';
import { getCurrentThemeColor } from '../../utils';
import { DECORATOR_COLORS } from '../../constants';

suite('getCurrentThemeColor Tests', () => {
  test('should return the correct color for light theme', () => {
    if (vscode.window.activeColorTheme.kind === vscode.ColorThemeKind.Light) {
      assert.strictEqual(getCurrentThemeColor('log'), DECORATOR_COLORS.light.log);
      assert.strictEqual(getCurrentThemeColor('warn'), DECORATOR_COLORS.light.warn);
      assert.strictEqual(getCurrentThemeColor('error'), DECORATOR_COLORS.light.error);
      assert.strictEqual(getCurrentThemeColor('info'), DECORATOR_COLORS.light.info);
      assert.strictEqual(getCurrentThemeColor('debug'), DECORATOR_COLORS.light.debug);
      assert.strictEqual(getCurrentThemeColor('table'), DECORATOR_COLORS.light.table);
    } else {
      assert.strictEqual(getCurrentThemeColor('log'), DECORATOR_COLORS.dark.log);
      assert.strictEqual(getCurrentThemeColor('warn'), DECORATOR_COLORS.dark.warn);
      assert.strictEqual(getCurrentThemeColor('error'), DECORATOR_COLORS.dark.error);
      assert.strictEqual(getCurrentThemeColor('info'), DECORATOR_COLORS.dark.info);
      assert.strictEqual(getCurrentThemeColor('debug'), DECORATOR_COLORS.dark.debug);
      assert.strictEqual(getCurrentThemeColor('table'), DECORATOR_COLORS.dark.table);
    }
  });

  test('should handle high contrast theme', () => {
    const originalTheme = vscode.window.activeColorTheme;

    Object.defineProperty(vscode.window, 'activeColorTheme', {
      value: { kind: vscode.ColorThemeKind.HighContrast },
      configurable: true,
    });

    const result = getCurrentThemeColor('log');
    assert.strictEqual(result, undefined);

    Object.defineProperty(vscode.window, 'activeColorTheme', {
      value: originalTheme,
      configurable: true,
    });
  });
});
