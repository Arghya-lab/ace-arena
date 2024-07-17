import { Server } from "socket.io";
import { SessionSocket } from "../@types/socket";
import Twenty9Room from "../models/Twenty9Room.model";
import { SeventhCardEnum, TrumpOptionsEnum } from "../@types/card";
import distributeAllTwenty9Cards from "./helpers/distributeAllTwenty9Cards.twenty9";

export default async function trumpSuiteSelect(
  this: { socket: SessionSocket; io: Server },
  payload: {
    roomCode: string;
    trumpSuit: TrumpOptionsEnum;
  }
) {
  const io = this.io;
  const session = this.socket.session;

  if (session) {
    try {
      const room = await Twenty9Room.findOne({
        roomCode: payload.roomCode,
        "players.clerkId": session.id,
      });
      if (room && room.gamePhase === "bided") {
        if (
          !room.isSeventhCardEnable &&
          payload.trumpSuit === SeventhCardEnum.SEVENTH
        ) {
          console.log("Invalid trumpSuit.");
          //  emit event for invalid trump suit select
        } else {
          room.trumpSuit = payload.trumpSuit;
          room.gamePhase = "trumpSelected";
          await room.save();

          //  TODO: notify all users
          await distributeAllTwenty9Cards(room, io);

          // TODO: Initialize game
        }
      }
    } catch {
      console.log("Error occur in trump select.");
    }
  }
}
