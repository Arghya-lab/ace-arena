import { Server } from "socket.io";
import { SessionSocket, SocketEvent } from "../../@types/socket";
import sendNotification from "../helpers/sendNotification.main";
import Twenty9Room from "../../models/Twenty9Room.model";
import selectTrumpSuite from "./helpers/selectTrumpSuite";

export default async function twenty9Bid(
  this: { socket: SessionSocket; io: Server },
  payload: {
    roomCode: string;
    bid: number | "pass";
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

      if (
        room &&
        room.firstBidder &&
        room.secondBidder &&
        room.gamePhase === "firstPhaseCardsDistributed"
      ) {
        room.isBidPassEnable = true;
        sendNotification({
          io,
          socketRooms: room.roomCode,
          type: "Twenty9_Bid",
          message:
            payload.bid === "pass"
              ? `${session.name} pass the bid.`
              : `${session.name} bided for ${payload.bid}.`,
        });

        if (payload.bid === "pass") {
          if (session.id === room.firstBidder.clerkId) {
            room.firstBidder = room.secondBidder;
            room.secondBidder = room.players.find(
              (player) =>
                player.playerId === (room.secondBidder!.playerId % 4) + 1
            );
          } else if (session.id === room.secondBidder.clerkId) {
            room.secondBidder = room.players.find(
              (player) =>
                player.playerId === (room.secondBidder!.playerId % 4) + 1
            );
          }
          room.totalParticipateBidder++;

          await room.save();
          if (room.totalParticipateBidder <= 4) {
            io.to(room.secondBidder!.clerkId).emit(SocketEvent.DO_TWENTY9_BID, {
              availableBids: room.getAvailableBids(),
            });
          } else {
            room.totalParticipateBidder = 4;
            room.firstBidder = undefined;
            room.secondBidder = undefined;
            room.gamePhase = "bided";

            await room.save();
          }
        } else if (
          payload.bid > room.highestBid ||
          (payload.bid === room.highestBid &&
            session.id === room.firstBidder.clerkId)
        ) {
          room.highestBid = payload.bid;

          if (session.id === room.firstBidder.clerkId) {
            room.highestBidderId = room.firstBidder.playerId;

            await room.save();
            io.to(room.secondBidder.clerkId).emit(SocketEvent.DO_TWENTY9_BID, {
              availableBids: room.getAvailableBids(),
            });
          } else if (session.id === room.secondBidder.clerkId) {
            room.highestBidderId = room.secondBidder.playerId;

            await room.save();
            io.to(room.firstBidder.clerkId).emit(SocketEvent.DO_TWENTY9_BID, {
              availableBids: room.getAvailableBids({ isFirstBidder: true }),
            });
          }
        } else {
          console.error("Invalid bid.");
        }

        const highestBidder = room.players.find(
          (player) => player.playerId === room.highestBidderId
        );

        if (highestBidder) {
          io.to(room.roomCode).emit(SocketEvent.TWENTY9_BID_CHANGE, {
            highestBid: room.highestBid,
            highestBidder,
          });
          sendNotification({
            io,
            socketRooms: room.roomCode,
            type: "Twenty9_Bid_winner",
            message: `Twenty 9 bid winner is ${highestBidder.name}.`,
          });

          if (room.gamePhase === "bided" && room.isDoubleRedoubleEnable) {
            //  if the game phase is bided & double redouble enable then emit `DOTWENTY9DOUBLECHALLENGE` event to bid winner opposition players
            const bidWinnerOppPlrRooms = room.players
              .filter((player) => player.teamId !== highestBidder.teamId)
              .map((player) => player.clerkId);

            io.to(bidWinnerOppPlrRooms).emit(
              SocketEvent.DO_TWENTY9_DOUBLE_CHALLENGE,
              { options: ["double", "pass"] }
            );

            const bidWinnerOppPlrNames = room.players
              .filter((player) => player.teamId !== highestBidder.teamId)
              .map((player) => player.name)
              .join(", ");
            sendNotification({
              io,
              socketRooms: room.roomCode,
              type: "Twenty9_Double_considering",
              message: `${bidWinnerOppPlrNames} considering for double challenge.`,
            });
          } else if (
            room.gamePhase === "bided" &&
            !room.isDoubleRedoubleEnable
          ) {
            //  if the game phase is bided but double redouble disable then emit event to bid winner for trump suite select
            await selectTrumpSuite(room, io);
          }
        } else {
          sendNotification({
            io,
            socketRooms: room.roomCode,
            type: "Error",
            message: "Error occur getting bid winner in server.",
          });
        }
      }
    } catch {
      console.log("Error occur in bidding.");
    }
  }
}
