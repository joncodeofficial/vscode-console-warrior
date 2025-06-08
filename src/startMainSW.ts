import portscanner from "portscanner";
import { WebSocket, WebSocketServer } from "ws";
import { WS_PORT } from "./constants";
import { IConsoleData } from "./types/consoleData.interface";
import { getPortFromUrl } from "./utils/getPortFromUrl";
import { ISourceMapCache } from "./types/sourceMapCache.interface";
import { IConsoleDataMap } from "./types/consoleDataMap.interface";

export async function startMainSW(
  consoleData: IConsoleData[],
  sourceMapCache: ISourceMapCache,
  consoleDataMap: IConsoleDataMap,
  backendConnections: Map<string, WebSocket>
) {
  const status = await portscanner.checkPortStatus(WS_PORT, "127.0.0.1");

  if (status === "closed") {
    // Create server WebSocket Central
    const wss = new WebSocketServer({ port: WS_PORT });
    console.log(`Central server started on port ${WS_PORT}`);

    wss.on("connection", (ws) => {
      consoleData.length = 0;
      sourceMapCache.clear();
      consoleDataMap.clear();

      let isBackend = false;
      let backendId: string | null = null;

      ws.on("message", (msg) => {
        const data: IConsoleData = JSON.parse(msg.toString());

        // 1. if is a server identify it
        if (data.type === "server-connect" && data.id) {
          backendId = data.id;
          backendConnections.set(data.id, ws);
          isBackend = true;
          console.log(`Server with id ${backendId} connected`);
          return;
        }

        // 2. if is a client frontend send message to a backend
        if (data.type === "client-message" && data.location.url) {
          const target = backendConnections.get(
            getPortFromUrl(data.location.url as string)
          );
          if (target && target.readyState === WebSocket.OPEN) {
            target.send(msg);
          } else {
            console.warn("No server found for client message");
          }
          return;
        }
      });

      ws.on("close", () => {
        if (isBackend && backendId) {
          backendConnections.delete(backendId);
          console.log(`Server ${backendId} disconnected`);
        }
      });
    });
  }
}
