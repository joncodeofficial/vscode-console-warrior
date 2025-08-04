export type ConsoleData = {
  where?: 'client-message' | 'server-connect';
  id?: string;
  message: string;
  location: {
    url: string;
    line: number;
    column: number;
  };
  timestamp: string;
};
