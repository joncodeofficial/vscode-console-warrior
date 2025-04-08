export interface IConsoleData {
  message: string;
  location: {
    url: string;
    line: number;
    column: number;
  };
}
