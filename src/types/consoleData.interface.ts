export type ConsoleData = {
  type?: 'client-message' | 'server-connect';
  id?: string;
  message: string;
  location: {
    url: string;
    line: number;
    column: number;
  };
};
