import { createServer } from "http";
import dotEnv from "dotenv";
import express from "express";
import cors from "cors";
import socketInit from "./lib/socketInit";
import connectToMongo from "./lib/db";
import routes from "./router";

dotEnv.config();

async function serverInit() {
  //  Create http server
  const app = express();
  app.use(cors());
  const httpServer = createServer(app);
  const PORT = process.env.PORT || 8000;

  // first connect to mongo db
  await connectToMongo();

  // routes
  app.use("/", routes);

  // init socket
  socketInit(httpServer);

  //  Start the server
  httpServer.listen(PORT, () => {
    console.log(`HTTP Server started at PORT:${PORT}`);
  });
}

serverInit();
