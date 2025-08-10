export const isConsoleCorrect = (line: string) => {
  const consoleMethods = '(log|warn|error|table|info|dir|trace|timeEnd|count)';

  // Verifica si hay un console.<method> en un comentario
  // Comentario de línea //
  if (new RegExp(`^\\s*//.*console\\.${consoleMethods}`).test(line)) {
    return false;
  }

  // Comentario de bloque /* */ (completo en una línea)
  if (new RegExp(`^\\s*/\\*.*console\\.${consoleMethods}.*\\*/`).test(line)) {
    return false;
  }

  // Dentro de un comentario de bloque multilínea
  // Detecta línea que comienza con /* y contiene console.<method>
  if (new RegExp(`^\\s*/\\*.*console\\.${consoleMethods}`).test(line) && !line.includes('*/')) {
    return false;
  }

  // Detecta línea dentro de un comentario multilinea (comienza con * o tiene * al inicio de texto)
  if (
    new RegExp(`^\\s*\\*.*console\\.${consoleMethods}`).test(line) &&
    !line.includes('*/') &&
    !line.includes('/*')
  ) {
    return false;
  }

  // Detecta una línea que termina un comentario multilinea y contiene console.<method>
  if (
    /.*\*\/\s*$/.test(line) &&
    new RegExp(`console\\.${consoleMethods}`).test(line) &&
    !line.includes('/*')
  ) {
    return false;
  }

  // Verifica el formato básico: debe contener al menos console.<method>(
  const hasBasicFormat = new RegExp(`console\\.${consoleMethods}\\(`).test(line);

  if (!hasBasicFormat) {
    return false; // No contiene el formato básico
  }

  // Si la línea parece ser una instrucción completa:
  // - Puede terminar con ); (con punto y coma)
  // - Puede terminar con ) (sin punto y coma)
  const isCompleteLineWithSemicolon = new RegExp(`console\\.${consoleMethods}\\(.*\\);`).test(line);
  const isCompleteLineWithoutSemicolon =
    new RegExp(`console\\.${consoleMethods}\\(.*\\)(?!\\w)`).test(line) && !line.includes(');');

  // Si la línea es parte de una instrucción multilinea
  const isMultiLine =
    line.trim().endsWith('\\') || // Línea continuada con backslash
    (new RegExp(`console\\.${consoleMethods}\\(`).test(line) && !line.includes(')')) || // Solo tiene el comienzo
    (/\);/.test(line) && !new RegExp(`console\\.${consoleMethods}`).test(line)) || // Solo tiene el final con punto y coma
    (/\)(?!\w)/.test(line) &&
      !new RegExp(`console\\.${consoleMethods}`).test(line) &&
      !line.includes(');')); // Solo tiene el final sin punto y coma

  // La línea es correcta si:
  // - Es una línea completa con formato correcto (con o sin punto y coma), o
  // - Es parte de una instrucción multilinea válida
  return isCompleteLineWithSemicolon || isCompleteLineWithoutSemicolon || isMultiLine;
};
