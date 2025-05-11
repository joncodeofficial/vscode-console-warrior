import httpProxy from "http-proxy";
import http from "http";
import { IncomingMessage, ServerResponse } from "http";
import { injectionCode } from "./services/injectionCode";

export const CreateProxy = (): void => {
  // Configurar el proxy HTTP
  const proxy = httpProxy.createProxyServer({});

  // Crear servidor proxy que inyecta el código en respuestas HTML
  const server = http.createServer(
    (req: IncomingMessage, res: ServerResponse) => {
      const _write = res.write;
      const _end = res.end;
      const chunks: Buffer[] = [];

      // Override write method
      res.write = function (chunk: Buffer | string): boolean {
        if (chunk) {
          chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
        }
        return true;
      };

      // Override end method
      res.end = function (
        chunk?: any,
        encoding?: BufferEncoding | (() => void),
        callback?: () => void
      ): ServerResponse {
        if (typeof encoding === "function") {
          callback = encoding;
          encoding = undefined;
        }

        if (chunk) {
          chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
        }

        const contentType = (res.getHeader("content-type") || "").toString();
        if (contentType.includes("text/html")) {
          const body = Buffer.concat(chunks).toString("utf8");
          const injectedBody = body.replace(
            "</head>",
            `${injectionCode}
            </head>`
          );
          res.removeHeader("content-length");
          _write.call(res, injectedBody, "utf8", () => {});
        } else {
          chunks.forEach((chunk: Buffer) =>
            _write.call(res, chunk, "utf8", () => {})
          );
        }

        return _end.call(res, undefined, "utf8", callback);
      };

      // Redirigir peticiones al servidor que corre en el puerto 5173
      proxy.web(req, res, {
        target: "http://localhost:5173",
      });
    }
  );

  // Iniciar el servidor proxy en el puerto 3000
  const PROXY_PORT = 3000;
  server.listen(PROXY_PORT, () => {
    console.log(`Proxy running on http://localhost:${PROXY_PORT}`);
    console.log(`WebSocket server running on port 9000`);
  });
};
