import * as vscode from 'vscode';
import { DECORATOR_COLORS } from '../constants';
import { ConsoleDataMapValues } from '../types';

// Get the current theme color
export const getCurrentThemeColor = (type: ConsoleDataMapValues['type']) => {
  switch (vscode.window.activeColorTheme.kind) {
    case vscode.ColorThemeKind.Light:
      return DECORATOR_COLORS.light[type];
    case vscode.ColorThemeKind.Dark:
      return DECORATOR_COLORS.dark[type];
  }
};
