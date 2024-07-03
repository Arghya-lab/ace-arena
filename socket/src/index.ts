import { createServer } from "http";
import dotEnv from "dotenv";
import socketInit from "./lib/socketInit";

dotEnv.config();

function serverInit() {
  //  Create http server with health url as /health
  const httpServer = createServer((req, res) => {
    if (req.method === "GET" && req.url === "/health") {
      res.writeHead(200, { "Content-Type": "text/plain" });
      res.end("Hello World!");
    }
  });
  const PORT = process.env.PORT || 8000;

  socketInit(httpServer);

  //  Start the server
  httpServer.listen(PORT, () => {
    console.log(`HTTP Server started at PORT:${PORT}`);
  });
}

serverInit();
