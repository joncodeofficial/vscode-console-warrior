import Denque from 'denque';
import { ConsoleData } from './consoleData.types';

export type ConsoleMessage = Pick<ConsoleData, 'message' | 'timestamp'>;

export type ConsoleDataMapValues = {
  type: ConsoleData['type'];
  counter: number;
  consoleMessages: Denque<ConsoleMessage>;
};

export type ConsoleDataMap = Map<string, Map<string, ConsoleDataMapValues>>;
