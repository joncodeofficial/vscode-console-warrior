export interface IConsoleData {
  type?: string;
  message: string;
  location: {
    url: string;
    line: number;
    column: number;
  };
}
