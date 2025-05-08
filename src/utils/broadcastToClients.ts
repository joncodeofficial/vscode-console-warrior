import WebSocket from "ws";

export function broadcastToClients(
  wss: WebSocket.Server,
  message: { type: string }
) {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(message));
    }
  });
}
