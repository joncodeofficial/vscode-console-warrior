export const isValidPort = (_port: number | string) => {
  const port = Number(_port);
  return port >= 0 && port <= 65535;
};
