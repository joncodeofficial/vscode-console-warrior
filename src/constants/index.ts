export const MAX_MESSAGE_LENGTH = 150;
export const UPDATE_RATE = 100;
export const MAX_DECORATIONS = 1000;
export const WS_PORT = 27020;
export const PROXY_PORT = 3000;
export const DEFAULT_PORT = 5173;

export const DECORATOR_COLORS = {
  light: {
    log: '#005f5f',
    warn: '#d58512',
    error: '#b52b27',
    table: '#005f5f',
    info: '#1e6bb8',
    debug: '#7b2d8e',
  },
  dark: {
    log: '#73daca',
    warn: '#f4b35a',
    error: '#ff4c4c',
    table: '#73daca',
    info: '#4da6ff',
    debug: '#c179e6',
  },
};

export const CONSOLE_COMMENTS_REGEX =
  /(?:^\s*(?:\/\/|\/\*|\*).*console\.|.*console\..*\*\/|console\.(?:log|warn|error|table|info|debug)\()/;
