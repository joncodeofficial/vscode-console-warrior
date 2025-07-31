export const isConsoleCorrect = (line: string) => {
  // Verifica si hay un console.log en un comentario
  // Comentario de línea //
  if (/^\s*\/\/.*console\.log/.test(line)) {
    return false;
  }

  // Comentario de bloque /* */ (completo en una línea)
  if (/^\s*\/\*.*console\.log.*\*\//.test(line)) {
    return false;
  }

  // Dentro de un comentario de bloque multilínea
  // Detecta línea que comienza con /* y contiene console.log
  if (/^\s*\/\*.*console\.log/.test(line) && !line.includes('*/')) {
    return false;
  }

  // Detecta línea dentro de un comentario multilinea (comienza con * o tiene * al inicio de texto)
  if (/^\s*\*.*console\.log/.test(line) && !line.includes('*/') && !line.includes('/*')) {
    return false;
  }

  // Detecta una línea que termina un comentario multilinea y contiene console.log
  if (/.*\*\/\s*$/.test(line) && line.includes('console.log') && !line.includes('/*')) {
    return false;
  }

  // Verifica el formato básico: debe contener al menos console.log(
  const hasBasicFormat = /console\.log\(/.test(line);

  if (!hasBasicFormat) {
    return false; // No contiene el formato básico
  }

  // Si la línea parece ser una instrucción completa:
  // - Puede terminar con ); (con punto y coma)
  // - Puede terminar con ) (sin punto y coma)
  const isCompleteLineWithSemicolon = /console\.log\(.*\);/.test(line);
  const isCompleteLineWithoutSemicolon =
    /console\.log\(.*\)(?!\w)/.test(line) && !line.includes(');');

  // Si la línea es parte de una instrucción multilinea
  const isMultiLine =
    line.trim().endsWith('\\') || // Línea continuada con backslash
    (/console\.log\(/.test(line) && !line.includes(')')) || // Solo tiene el comienzo
    (/\);/.test(line) && !line.includes('console.log')) || // Solo tiene el final con punto y coma
    (/\)(?!\w)/.test(line) && !line.includes('console.log') && !line.includes(');')); // Solo tiene el final sin punto y coma

  // La línea es correcta si:
  // - Es una línea completa con formato correcto (con o sin punto y coma), o
  // - Es parte de una instrucción multilinea válida
  return isCompleteLineWithSemicolon || isCompleteLineWithoutSemicolon || isMultiLine;
};
