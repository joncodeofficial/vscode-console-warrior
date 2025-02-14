export const isValidPort = (value: number | string) => {
  const port = Number(value);
  return port >= 0 && port <= 65535;
};
