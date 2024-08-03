import { Server } from "socket.io";
import { SeventhCardEnum, TrumpOptionsEnum } from "../@types/card";
import { SessionSocket } from "../@types/socket";
import Twenty9Room from "../models/Twenty9Room.model";
import distributeAllTwenty9Cards from "./helpers/distributeAllTwenty9Cards.twenty9";
import sendNotification from "./helpers/sendNotification.main";

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
          sendNotification({
            io,
            socketRooms: session.id,
            type: "Error",
            message: `Invalid trumpSuit.`,
          });
        } else {
          room.trumpSuit = payload.trumpSuit;
          room.gamePhase = "trumpSelected";
          await room.save();

          sendNotification({
            io,
            socketRooms: room.roomCode,
            type: "Twenty9_Trump_Suit_selected",
            message: `Trump suit is selected now game will start.`,
          });

          await distributeAllTwenty9Cards(room, io);
        }
      }
    } catch {
      console.log("Error occur in trump select.");
    }
  }
}
