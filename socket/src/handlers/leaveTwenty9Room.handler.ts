import { Server } from "socket.io";
import { SessionSocket, SocketEvent } from "../@types/socket";
import Twenty9Room from "../models/Twenty9Room.model";

export default async function leaveTwenty9Room(
  this: { socket: SessionSocket; io: Server },
  payload: { roomCode: string }
) {
  const io = this.io;
  const socket = this.socket;
  const session = this.socket.session;

  if (session) {
    try {
      const room = await Twenty9Room.findOne({
        roomCode: payload.roomCode,
        "players.clerkId": session.id,
        "players.isRoomAdmin": false,
      });

      if (room) {
        const updatedRoom = await Twenty9Room.findByIdAndUpdate(
          room._id,
          {
            $pull: { players: { clerkId: session.id } },
          },
          { new: true }
        );

        if (updatedRoom) {
          if (updatedRoom.players.length === 0) {
            await Twenty9Room.findByIdAndDelete(room._id);
          }

          socket.leave(room.roomCode);
          io.to(session.id).emit(SocketEvent.ROOMLEAVE);

          io.to(room.roomCode).emit(
            SocketEvent.PLAYERSINROOM,
            updatedRoom.players
          );
        }
      }
    } catch (error) {
      console.error("Error leaving room.");
    }
  }
}
