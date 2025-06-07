// Compilas una sola vez la expresión regular
const portRegex = /:(\d+)(?=\/|$)/;

export const getPortFromUrl = (url: string): string => {
  const match = portRegex.exec(url);
  return match ? match[1] : "";
};
