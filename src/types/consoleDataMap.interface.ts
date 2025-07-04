import Denque from 'denque';

type ConsoleDataMapValues = {
  counter: number;
  consoleMessages: Denque<string>;
};

export type ConsoleDataMap = Map<string, Map<string, ConsoleDataMapValues>>;
