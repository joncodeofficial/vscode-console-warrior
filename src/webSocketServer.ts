import * as vscode from 'vscode';
import portscanner from 'portscanner';
import { WebSocket, WebSocketServer } from 'ws';
import { WS_PORT } from './constants';
import { ConsoleData, ConsoleDataMap, ServerConnections, SourceMapCache } from './types';
import { getPortFromUrl } from './utils';

// Start Main WebSocket Server
export const startWebSocketServer = async (
  consoleData: ConsoleData[],
  sourceMapCache: SourceMapCache,
  consoleDataMap: ConsoleDataMap,
  backendConnections: ServerConnections
) => {
  const status = await portscanner.checkPortStatus(WS_PORT, '127.0.0.1');

  if (status === 'closed') {
    // Create server WebSocket  Main
    const wss = new WebSocketServer({ port: WS_PORT });
    console.log(`[Central WS] started on port ${WS_PORT}`);

    // Temporary map to store workspace -> WebSocket connections before port assignment
    const pendingConnections = new Map<string, WebSocket>();

    wss.on('connection', (ws) => {
      consoleData.length = 0;
      sourceMapCache.clear();
      consoleDataMap.clear();

      let isBackend = false;
      let backendId: string | null = null;

      // Listen for messages from clients
      ws.on('message', (msg) => {
        const data: any = JSON.parse(msg.toString());

        // Handle server-info: backend sends port and workspace
        if (data.where === 'server-info' && data.id && data.workspace) {
          console.log(`[Server Info] Port ${data.id} -> Workspace ${data.workspace}`);

          // Check if there's a pending connection for this workspace
          const pendingWs = pendingConnections.get(data.workspace);
          if (pendingWs && pendingWs.readyState === WebSocket.OPEN) {
            // Move from pending to active connections using the port as key (ensure string)
            const portKey = data.id.toString();
            backendConnections.set(portKey, pendingWs);
            pendingConnections.delete(data.workspace);
            console.log(`[Server Info] Matched workspace ${data.workspace} with port ${portKey}`);
            console.log(
              `[Server Info] backendConnections keys:`,
              Array.from(backendConnections.keys())
            );
          }
          return;
        }

        // Handle server-connect: extension sends workspace path
        if (data.where === 'server-connect' && data.workspace) {
          console.log(`[Server Connect] Workspace ${data.workspace} connected`);
          // Store temporarily until we get the port from server-info
          pendingConnections.set(data.workspace, ws);
          isBackend = true;
          console.log(`[Server Connect] Stored pending connection for workspace ${data.workspace}`);
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

// Connect to Main WebSocket Server like a client
export const connectWebSocketServer = (
  port: number,
  consoleData: ConsoleData[],
  sourceMapCache?: SourceMapCache,
  consoleDataMap?: ConsoleDataMap,
  backendConnections?: ServerConnections
) => {
  const socket = new WebSocket(`ws://localhost:${WS_PORT}`);

  // // Handle WebSocket connection open event
  socket.on('open', () => {
    console.log('[Client WS] Connected to Central with port:', port);
    const folders = vscode.workspace.workspaceFolders;

    if (folders) {
      folders.forEach((folder) => {
        socket.send(JSON.stringify({ where: 'server-connect', workspace: folder.uri.fsPath }));
      });
    }
  });

  // Handle incoming messages
  socket.on('message', (message) => {
    try {
      const data: ConsoleData = JSON.parse(message.toString());
      consoleData.push(data);
    } catch {
      console.warn('Error parsing WebSocket message');
    }
  });

  // Handle close event with auto-recovery
  socket.on('close', async () => {
    if (!sourceMapCache || !consoleDataMap || !backendConnections) return;
    console.log('[Server WS] Disconnected - attempting to restart Central server...');
    // Try to restart the central server and reconnect
    await startWebSocketServer(consoleData, sourceMapCache, consoleDataMap, backendConnections);

    // Try to connect again after 2 seconds
    setTimeout(() => {
      connectWebSocketServer(port, consoleData, sourceMapCache, consoleDataMap, backendConnections);
      console.log('[Server WS] Reconnected to Central server');
    }, 2000);
  });

  // Handle error event
  socket.on('error', (_) => console.error('[Server WS] Error connecting to Main server'));

  return socket;
};
