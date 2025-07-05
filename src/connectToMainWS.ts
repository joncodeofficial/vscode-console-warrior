import { WebSocket } from 'ws';
import { ConsoleData } from './types';
import { WS_PORT } from './constants';

export const connectToMainWS = (port: number, consoleData: ConsoleData[]) => {
  const socket = new WebSocket(`ws://localhost:${WS_PORT}`);

  // Handle WebSocket connection open event
  socket.on('open', () => {
    console.log('[Client WS] Connected to Central with port:', port);
    socket.send(JSON.stringify({ type: 'server-connect', id: port.toString() }));
  });

  // Handle incoming messages
  socket.on('message', (message) => {
    try {
      const data: ConsoleData = JSON.parse(message.toString());
      consoleData.push(data);
    } catch (_) {
      console.warn('Error parsing WebSocket message');
    }
  });

  // Handle WebSocket events
  socket.on('close', () => {
    console.log('[Server WS] Disconnected');
  });

  // Handle errors
  socket.on('error', (_) => {
    console.error('[Server WS] Error connecting to Central');
  });

  return socket;
};
