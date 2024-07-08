import { Server } from "socket.io";
import { SessionSocket } from "../@types/socket";

export default function onSocketDisconnect(this: {
  socket: SessionSocket;
  io: Server;
}) {
  const socket = this.socket;

  if (socket.session) {
    socket.leave(socket.session.id);

    console.log(
      `Socket disconnected socketId: ${socket.id}, clerkId: ${socket.session.id}`
    );
  }
}
