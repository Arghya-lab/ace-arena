import { Server } from "socket.io";
import { SessionSocket, SocketEvent } from "../@types/socket";
import Twenty9Room from "../models/Twenty9Room.model";

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

      if (room && room.firstBidder && room.secondBidder) {
        room.isBidPassEnable = true;

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
            io.to(room.secondBidder!.clerkId).emit(SocketEvent.DOTWENTY9BID, {
              availableBids: room.getAvailableBids(),
            });
          } else {
            room.totalParticipateBidder = 4;
            room.gamePhase = "bided";
            await room.save();

            console.log({
              highestBid: room.highestBid,
              highestBidder: room.highestBidderId,
            });
            // handle double re-double =>=> bid winner select trump suite =>=> distribute second phase cards
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
            io.to(room.secondBidder.clerkId).emit(SocketEvent.DOTWENTY9BID, {
              availableBids: room.getAvailableBids(),
            });
          } else if (session.id === room.secondBidder.clerkId) {
            room.highestBidderId = room.secondBidder.playerId;

            await room.save();
            io.to(room.firstBidder.clerkId).emit(SocketEvent.DOTWENTY9BID, {
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
          io.to(room.roomCode).emit(SocketEvent.TWENTY9BIDCHANGE, {
            highestBid: room.highestBid,
            highestBidder,
          });
        }
      }
    } catch {
      console.log("Error occur in bidding.");
    }
  }
}
