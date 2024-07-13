import { Server } from "socket.io";
import { SessionSocket } from "../@types/socket";
import Twenty9Room from "../models/Twenty9Room.model";
import { ITwenty9RoomDocument } from "../schema/twenty9Room.schema";
import distributeFirstPhaseCards from "./helpers/distributeFirstPhaseCards.twenty9";
import startBiding from "./helpers/startBidding.twenty9";

export default async function startTwenty9game(
  this: { socket: SessionSocket; io: Server },
  payload: {
    roomCode: string;
  }
) {
  const io = this.io;
  const session = this.socket.session;

  if (session) {
    try {
      let room: ITwenty9RoomDocument | null = await Twenty9Room.findOne({
        roomCode: payload.roomCode,
        "players.clerkId": session.id,
        "players.isRoomAdmin": true,
      });

      if (room) {
        await distributeFirstPhaseCards(room, io);

        await startBiding(room, io, session);
      }
    } catch (error) {
      console.error("Error starting twenty 9 game.");
    }
  }
}
