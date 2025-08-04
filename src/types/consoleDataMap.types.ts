import Denque from 'denque';

type ConsoleDataMapValues = {
  counter: number;
  consoleMessages: Denque<ConsoleDataMapValue>;
};

export type ConsoleDataMapValue = {
  message: string;
  timestamp: string;
};

export type ConsoleDataMap = Map<string, Map<string, ConsoleDataMapValues>>;
