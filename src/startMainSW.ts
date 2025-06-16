import portscanner from 'portscanner';
import { WebSocket, WebSocketServer } from 'ws';
import { WS_PORT } from './constants';
import { ConsoleData } from './types/consoleData.interface';
import { getPortFromUrl } from './utils/getPortFromUrl';
import { SourceMapCache } from './types/sourceMapCache.interface';
import { ConsoleDataMap } from './types/consoleDataMap.interface';

export async function startMainSW(
  consoleData: ConsoleData[],
  sourceMapCache: SourceMapCache,
  consoleDataMap: ConsoleDataMap,
  backendConnections: Map<string, WebSocket>
) {
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

      ws.on('message', (msg) => {
        const data: ConsoleData = JSON.parse(msg.toString());

        // 1. if is a server identify it
        if (data.type === 'server-connect' && data.id) {
          backendId = data.id;
          backendConnections.set(data.id, ws);
          isBackend = true;
          console.log(`[Client WS] with id ${backendId} connected`);
          return;
        }

        // 2. if is a client frontend send message to a backend
        if (data.type === 'client-message' && data.location.url) {
          const getPort = getPortFromUrl(data.location.url as string);
          const getMessage = data.message;
          const target = backendConnections.get(getPort);
          if (getMessage && target && target.readyState === WebSocket.OPEN) {
            target.send(msg);
          } else {
            console.warn('No server found for client message');
          }
          return;
        }
      });

      ws.on('close', () => {
        if (isBackend && backendId) {
          backendConnections.delete(backendId);
          console.log(`Server ${backendId} disconnected`);
        }
      });
    });
  }
}
