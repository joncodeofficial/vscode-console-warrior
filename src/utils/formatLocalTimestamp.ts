// Format the local timestamp
export const formatLocalTimestamp = (timestamp: string | number) => {
  const digits = '2-digit';
  const date = new Date(timestamp);
  if (isNaN(date.getTime())) return '00:00:00.000';
  return date.toLocaleTimeString(undefined, {
    hour12: false,
    hour: digits,
    minute: digits,
    second: digits,
    fractionalSecondDigits: 3,
  });
};
