import { WebSocket } from "ws";
import { IConsoleData } from "./types/consoleData.interface";
import { WS_PORT } from "./constants";

export const connectToMainWS = (port: number, consoleData: IConsoleData[]) => {
  const socket = new WebSocket(`ws://localhost:${WS_PORT}`);

  socket.on("open", () => {
    console.log("[Client WS] Connected to Central with port:", port);

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
