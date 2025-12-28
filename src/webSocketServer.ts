import * as vscode from 'vscode';
import portscanner from 'portscanner';
import { WebSocket, WebSocketServer } from 'ws';
import { WS_PORT } from './constants';
import { ConsoleData, ConsoleDataMap, ServerConnections, SourceMapCache } from './types';
import { getPortFromUrl, detectViteProjects } from './utils';

// Start Main WebSocket Server
export const startWebSocketServer = async (
  consoleData: ConsoleData[],
  sourceMapCache: SourceMapCache,
  consoleDataMap: ConsoleDataMap,
  backendConnections: ServerConnections
): Promise<WebSocketServer | null> => {
  const status = await portscanner.checkPortStatus(WS_PORT, '127.0.0.1');

  if (status === 'closed') {
    // Create server WebSocket  Main
    const wss = new WebSocketServer({ port: WS_PORT });
    console.log(`[Central WS] started on port ${WS_PORT}`);

    // Temporary map to store workspace -> WebSocket connections before port assignment
    const pendingConnections = new Map<string, WebSocket>();
    // Map to track which workspace is using which port (workspace -> port)
    const workspaceToPorts = new Map<string, string>();

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
          // Normalize workspace path to lowercase for case-insensitive comparison (Windows)
          const normalizedWorkspace = data.workspace.toLowerCase();

          // Check if there's a pending connection for this workspace
          const pendingWs = pendingConnections.get(normalizedWorkspace);

          if (pendingWs && pendingWs.readyState === WebSocket.OPEN) {
            const portKey = data.id.toString();

            // 1. Clean up old port for THIS specific workspace (if it had a different port before)
            const oldPort = workspaceToPorts.get(normalizedWorkspace);
            if (oldPort && oldPort !== portKey) {
              backendConnections.delete(oldPort);
            }

            // 2. Check if another workspace was using this port and clean it up
            for (const [ws, port] of workspaceToPorts.entries()) {
              if (port === portKey && ws !== normalizedWorkspace) {
                workspaceToPorts.delete(ws);
              }
            }

            // 3. Add to active connections using the new port as key
            backendConnections.set(portKey, pendingWs);
            // Track which port this workspace is using
            workspaceToPorts.set(normalizedWorkspace, portKey);
          }
          return;
        }

        // Handle server-connect: extension sends workspace path
        if (data.where === 'server-connect' && data.workspace) {
          // Normalize workspace path to lowercase for case-insensitive comparison (Windows)
          const normalizedWorkspace = data.workspace.toLowerCase();

          // Store workspace connection (persistent for reconnections)
          if (!pendingConnections.has(normalizedWorkspace)) {
            pendingConnections.set(normalizedWorkspace, ws);
            isBackend = true;
          }
          return;
        }

        // if is a client frontend send message to a backend
        if (data.where === 'client-message' && data.location.url) {
          const getPort = getPortFromUrl(data.location.url);
          const target = backendConnections.get(getPort);

          if (data.message && target?.readyState === WebSocket.OPEN) {
            // Find the workspace for this port
            let workspacePath: string | undefined;
            for (const [workspace, port] of workspaceToPorts.entries()) {
              if (port === getPort) {
                workspacePath = workspace;
                break;
              }
            }

            // Enrich the message with workspace information
            const enrichedData = {
              ...data,
              workspacePath,
            };

            target.send(JSON.stringify(enrichedData));
          } else {
            console.warn(`[Client Message] No server found for port ${getPort}`);
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

    return wss;
  }

  return null;
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
  socket.on('open', async () => {
    // Detect all Vite projects in the workspace
    const viteProjectPaths = await detectViteProjects();

    if (viteProjectPaths.length > 0) {
      // Send server-connect for each Vite project path
      viteProjectPaths.forEach((projectPath) => {
        socket.send(JSON.stringify({ where: 'server-connect', workspace: projectPath }));
      });
    } else {
      // Fallback: if no Vite projects detected, use workspace folders
      const folders = vscode.workspace.workspaceFolders;
      if (folders) {
        folders.forEach((folder) => {
          socket.send(JSON.stringify({ where: 'server-connect', workspace: folder.uri.fsPath }));
        });
      }
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
