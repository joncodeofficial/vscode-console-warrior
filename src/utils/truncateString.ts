import { MAX_MESSAGE_LENGTH } from '../constants';

export const truncateString = (str: string): string => {
  if (str.length <= MAX_MESSAGE_LENGTH) return str;
  return str.slice(0, MAX_MESSAGE_LENGTH) + ' ...';
};
