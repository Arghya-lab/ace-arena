import { Server } from "socket.io";
import { SessionSocket, SocketEvent } from "../@types/socket";
import Twenty9Room from "../models/Twenty9Room.model";
import selectTrumpSuite from "./helpers/selectTrumpSuite.twenty9";
import sendNotification from "./helpers/sendNotification.main";

export default async function doubleChallenge(
  this: { socket: SessionSocket; io: Server },
  {
    roomCode,
    payload,
  }: {
    roomCode: string;
    payload: "double" | "pass";
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
        room.doubleChallengeEvaluated < 2
      ) {
        const player = room.players.find(
          (player) => player.clerkId === session.id
        );
        const highestBidder = room.players.find(
          (player) => player.playerId === room.highestBidderId
        );

        if (
          player &&
          highestBidder &&
          Math.abs(player.playerId - room.highestBidderId) % 2 === 1
          //  Math.abs(player.playerId - room.highestBidderId) % 2 will be 1 for opposite team player
        ) {
          if (payload === "double") {
            room.isDouble = true;
            room.doubleChallengeBy.push(player);
            room.doubleChallengeEvaluated++;
            await room.save();

            io.to(room.roomCode).emit(
              SocketEvent.TWENTY9_DOUBLE_REDOUBLE_CHANGE,
              {
                isDouble: true,
              }
            );
          } else {
            room.doubleChallengeEvaluated++;
            await room.save();
          }

          //  if both opposition player emit event for there double challenge plan
          if (room.doubleChallengeEvaluated === 2) {
            if (room.doubleChallengeBy.length === 0) {
              sendNotification({
                io,
                socketRooms: room.roomCode,
                type: "Twenty9_Double_decision",
                message: `Double challengers are pass for challenge.`,
              });

              // nobody double challenged so emit event for trump suit select to bid winner
              await selectTrumpSuite(room, io);
            } else {
              //  of any one double challenged then emit event for redouble challenge
              io.to(highestBidder.clerkId).emit(
                SocketEvent.DO_TWENTY9_REDOUBLE_CHALLENGE,
                {
                  doubleChallengeBy: room.doubleChallengeBy,
                  options: ["redouble", "pass"],
                }
              );

              sendNotification({
                io,
                socketRooms: room.roomCode,
                type: "Twenty9_Double_decision",
                message: `${room.doubleChallengeBy.map((player) => player.name).join(", ")} double challenged & ${highestBidder.name} considering for redouble challenge.`,
              });
            }
          }
        }
      }
    } catch {
      console.log("Error occur in double challenge.");
    }
  }
}
