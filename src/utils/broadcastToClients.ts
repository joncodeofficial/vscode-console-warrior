import WebSocket from 'ws';

export function broadcastToClients(wss: WebSocket.Server, message: { type: string }) {
  for (const client of wss.clients) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(message));
    }
  }
}
