export type IConsoleData = {
  type?: string;
  id?: string;
  message: string;
  location: {
    url: string;
    line: number;
    column: number;
  };
};
