import { Server } from "socket.io";
import { SessionSocket } from "../@types/socket";
import sendNotification from "./helpers/sendNotification.main";

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
    sendNotification({
      io: this.io,
      socketRooms: socket.session.id,
      type: "Error",
      message: `You are disconnected from server.`,
    });
  }
}
