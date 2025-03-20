type CallbackFunction<T> = (array: T[]) => void;

export function monitorChanges<T>(
  array: T[],
  callback: CallbackFunction<T>,
  interval: number = 500
): () => void {
  let lastState = JSON.stringify(array);

  const intervalId = setInterval(() => {
    const currentState = JSON.stringify(array);

    if (currentState !== lastState) {
      callback(array);
      lastState = currentState;
    }
  }, interval);

  // Retorna función para detener el monitoreo
  return () => clearInterval(intervalId);
}
