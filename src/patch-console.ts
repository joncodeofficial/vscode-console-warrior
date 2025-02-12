// VS Code Console Warrior Extension

// src/patch-console.ts
export function applyConsolePatch() {
  // Guarda una referencia al console.log original
  const originalLog = console.log;

  // Redefine console.log
  Object.defineProperty(console, "log", {
    writable: true,
    enumerable: true,
    configurable: true,
    value: function (...args: any[]) {
      const modifiedArgs = args.map((arg) =>
        typeof arg === "string" ? `${arg} Console Warrior` : arg
      );
      originalLog.apply(console, modifiedArgs);
    },
  });

  return () => {
    // Función para restaurar el console.log original
    console.log = originalLog;
  };
}
