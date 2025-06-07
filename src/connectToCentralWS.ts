import { WebSocket } from "ws";
import { IConsoleData } from "./types/consoleData.interface";

export const connectToCentralWS = (
  server: number,
  port: number,
  consoleData: IConsoleData[]
) => {
  const socket = new WebSocket(`ws://localhost:${server}`);

  socket.on("open", () => {
    console.log("[Server WS] Connected to Central using port:", port);

    socket.send(
      JSON.stringify({ type: "server-connect", id: port.toString() })
    );
  });

  socket.on("message", (message) => {
    try {
      const data: IConsoleData = JSON.parse(message.toString());
      consoleData.push(data);
    } catch (e) {
      console.warn("Error parsing WebSocket message");
    }
  });

  socket.on("close", () => {
    console.log("[Server WS] Disconnected");
  });

  socket.on("error", (err) => {
    console.error("[Server WS] Error:", err);
  });

  return socket;
};
