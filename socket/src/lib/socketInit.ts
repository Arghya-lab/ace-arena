import { Server } from "http";
import { Server as SocketServer } from "socket.io";

export default function socketInit(server: Server) {
  // Create server io
  const io = new SocketServer(server, {
    cors: {
      origin: "*",
    },
  });

  io.on("connect", (socket) => {
    console.log(`New Socket Connected`, socket.id);

    //  Socket events
    socket.on("event:message", async (data) => {
      console.log(data);
    });

    socket.on("disconnect", () => {
      console.log("user disconnected");
    });
  });
}
