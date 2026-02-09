// Store messages by ID so command URIs stay short regardless of message size
const messageStore = new Map<string, string>();
let idCounter = 0;

export const storeMessage = (message: string): string => {
  const id = String(idCounter++);
  messageStore.set(id, message);
  return id;
};

export const getMessage = (id: string): string | undefined => {
  return messageStore.get(id);
};

export const clearMessageStore = (): void => {
  messageStore.clear();
  idCounter = 0;
};
