export const formatString = (message: string) => {
  return message
    .replace(/\n/g, "") // Eliminar saltos de línea literales
    .replace(/\\n/g, "") // Eliminar \n como texto
    .replace(/\t/g, "") // Eliminar tabs literales
    .replace(/\\t/g, "") // Eliminar \t como texto
    .replace(/^\s+|\s+$/g, "") // Eliminar espacios al inicio y final
    .replace(/\s{2,}/g, " "); // Reemplazar múltiples espacios por uno solo
};
