import net from 'net';

// Checks whether a TCP port is free on the given host by attempting to connect to it.
// A refused connection means nothing is listening there (port is available).
export const isPortAvailable = (port: number, host: string): Promise<boolean> => {
  return new Promise((resolve) => {
    const socket = net.createConnection({ port, host });

    socket.once('connect', () => {
      socket.destroy();
      resolve(false);
    });

    socket.once('error', () => {
      socket.destroy();
      resolve(true);
    });
  });
};
