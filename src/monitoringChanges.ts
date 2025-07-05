import { createHash } from 'crypto';
import { UPDATE_RATE } from './constants';

type CallbackFunction<T> = (array: T[]) => void;

// Hash an array
const hashArray = <T>(array: T[]) => {
  return createHash('sha1').update(JSON.stringify(array)).digest('hex');
};

// Monitor changes in an array and call a callback function when changes occurx
export const monitoringChanges = <T>(array: T[], callback: CallbackFunction<T>) => {
  let lastHash = hashArray(array);

  const intervalId = setInterval(() => {
    const currentHash = hashArray(array);
    if (currentHash !== lastHash) {
      callback(array);
      lastHash = currentHash;
    }
  }, UPDATE_RATE);

  return () => clearInterval(intervalId);
};
