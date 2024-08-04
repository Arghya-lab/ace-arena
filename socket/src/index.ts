import cors from "cors";
import dotEnv from "dotenv";
import express from "express";
import { createServer } from "http";
import connectToMongo from "./db";
import routes from "./router";
import socketInit from "./socketListeners";

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
