import { MAX_MESSAGE_LENGTH } from "../constants";

export const truncateStr = (str: string) => {
  return str.length > MAX_MESSAGE_LENGTH
    ? str.slice(0, MAX_MESSAGE_LENGTH) + "..."
    : str;
};
