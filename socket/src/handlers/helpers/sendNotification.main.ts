import { Server } from "socket.io";
import { NotificationType, SocketEvent } from "../../@types/socket";

export default function sendNotification({
  io,
  socketRooms,
  type,
  message,
}: {
  io: Server;
  socketRooms: string | string[];
  type?: NotificationType;
  message: string;
}) {
  io.to(socketRooms).emit(SocketEvent.NOTIFICATION, { type, message });
}
