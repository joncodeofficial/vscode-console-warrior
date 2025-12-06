export type ConsoleData = {
  id?: string;
  type: 'log' | 'warn' | 'error' | 'table' | 'info' | 'debug'; // | 'timeEnd';
  where?: 'client-message' | 'server-connect' | 'server-info';
  message: string;
  location: {
    url: string;
    line: number;
    column: number;
  };
  timestamp: string;
  workspacePath?: string;
};
