import { Server } from "socket.io";
import { SessionSocket, SocketEvent } from "../@types/socket";
import Twenty9Room from "../models/Twenty9Room.model";
import { get29Game1stHandCards } from "../cards";

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
      let room = await Twenty9Room.findOne({
        roomCode: payload.roomCode,
        "players.clerkId": session.id,
        "players.isRoomAdmin": true,
      });

      if (room) {
        room.cardDistributions = get29Game1stHandCards();
        room.gamePhase = "firstPhaseCardsDistributed";
        await room.save();

        room.players.forEach((player) => {
          const playerFirstHandCards =
            room.cardDistributions.find(
              (cardDistribution) =>
                cardDistribution.playerId === player.playerId
            )?.cards || [];

          io.to(player.clerkId).emit(
            SocketEvent.TWENTY9FIRSTHAND,
            playerFirstHandCards
          );
        });
      }
    } catch (error) {
      console.error("Error starting twenty 9 game.");
    }
  }
}
