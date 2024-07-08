import { Server } from "socket.io";
import { SessionSocket, SocketEvent } from "../@types/socket";
import Twenty9Room from "../models/Twenty9Room.model";

export default async function deleteTwenty9Room(
  this: { socket: SessionSocket; io: Server },
  payload: { roomCode: string }
) {
  const io = this.io;
  const session = this.socket.session;

  if (session) {
    try {
      const room = await Twenty9Room.findOne({
        roomCode: payload.roomCode,
        "players.clerkId": session.id,
        "players.isRoomAdmin": true,
      });

      if (room) {
        Twenty9Room.findByIdAndDelete(room._id).then(() => {
          io.in(room._id.toString()).socketsLeave(room._id.toString());
          io.to(room.players.map((player) => player.clerkId)).emit(
            SocketEvent.ROOMLEAVE
          );
        });
      }
    } catch (error) {
      console.error("Error deleting room.");
    }
  }
}
