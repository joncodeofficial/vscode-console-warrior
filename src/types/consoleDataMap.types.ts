import Denque from 'denque';
import { ConsoleData } from './consoleData.types';

export type ConsoleDataMapValue = {
  type: ConsoleData['type'];
  counter: number;
  consoleMessages: Denque<Pick<ConsoleData, 'message' | 'timestamp'>>;
};

export type ConsoleMessagesType =
  ConsoleDataMapValue['consoleMessages'] extends Denque<infer T> ? T : never;

export type ConsoleDataMap = Map<string, Map<string, ConsoleDataMapValue>>;
