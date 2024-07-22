import { Server } from "socket.io";
import { SessionSocket, SocketEvent } from "../@types/socket";
import Twenty9Room from "../models/Twenty9Room.model";
import selectTrumpSuite from "./helpers/selectTrumpSuite.twenty9";
import sendNotification from "./helpers/sendNotification.main";

export default async function redoubleChallenge(
  this: { socket: SessionSocket; io: Server },
  {
    roomCode,
    payload,
  }: {
    roomCode: string;
    payload: "redouble" | "pass";
  }
) {
  const io = this.io;
  const session = this.socket.session;

  if (session) {
    try {
      const room = await Twenty9Room.findOne({
        roomCode: roomCode,
        "players.clerkId": session.id,
      });

      if (
        room &&
        room.gamePhase === "bided" &&
        room.isDoubleRedoubleEnable &&
        room.highestBidderId &&
        room.isDouble
      ) {
        sendNotification({
          io,
          socketRooms: room.roomCode,
          type: "Twenty9_Redouble_decision",
          message:
            payload === "pass"
              ? `${session.name} pass the redouble challenge.`
              : `Redouble challenge by ${session.name}.`,
        });

        if (payload === "redouble") {
          const player = room.players.find(
            (player) => player.clerkId === session.id
          );

          if (player && player.playerId === room.highestBidderId) {
            await Twenty9Room.findByIdAndUpdate(room._id, {
              isDouble: false,
              isRedouble: true,
            });

            io.to(room.roomCode).emit(
              SocketEvent.TWENTY9_DOUBLE_REDOUBLE_CHANGE,
              {
                isRedouble: true,
              }
            );
          }
        }

        await selectTrumpSuite(room, io);
      }
    } catch {
      console.log("Error occur in redouble challenge.");
    }
  }
}
