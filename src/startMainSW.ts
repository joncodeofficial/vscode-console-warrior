import portscanner from 'portscanner';
import { WebSocket, WebSocketServer } from 'ws';
import { WS_PORT } from './constants';
import { ConsoleData, ConsoleDataMap, ServerConnections, SourceMapCache } from './types';
import { getPortFromUrl } from './utils';

// Start Main Server
export const startMainSW = async (
  consoleData: ConsoleData[],
  sourceMapCache: SourceMapCache,
  consoleDataMap: ConsoleDataMap,
  backendConnections: ServerConnections
) => {
  const status = await portscanner.checkPortStatus(WS_PORT, '127.0.0.1');

  if (status === 'closed') {
    // Create server WebSocket Central
    const wss = new WebSocketServer({ port: WS_PORT });

    console.log(`[Central WS] started on port ${WS_PORT}`);

    wss.on('connection', (ws) => {
      consoleData.length = 0;
      sourceMapCache.clear();
      consoleDataMap.clear();

      let isBackend = false;
      let backendId: string | null = null;

      // Listen for messages from clients
      ws.on('message', (msg) => {
        const data: ConsoleData = JSON.parse(msg.toString());

        // if is a server identify it
        if (data.where === 'server-connect' && data.id) {
          backendId = data.id;
          backendConnections.set(data.id, ws);
          isBackend = true;
          console.log(`[Client WS] with id ${backendId} connected`);
          return;
        }

        // if is a client frontend send message to a backend
        if (data.where === 'client-message' && data.location.url) {
          const getPort = getPortFromUrl(data.location.url);
          const target = backendConnections.get(getPort);
          if (data.message && target?.readyState === WebSocket.OPEN) {
            target.send(msg);
          } else {
            console.warn('No server found for client message');
          }
          return;
        }
      });

      // Close server WebSocket Central
      ws.on('close', () => {
        if (isBackend && backendId) {
          backendConnections.delete(backendId);
          console.log(`Server ${backendId} disconnected`);
        }
      });
    });
  }
};
