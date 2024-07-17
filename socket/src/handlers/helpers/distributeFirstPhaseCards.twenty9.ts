import { Server } from "socket.io";
import { ICard, ICardCounts } from "../../@types/card";
import { SocketEvent } from "../../@types/socket";
import { ITwenty9RoomDocument } from "../../schema/twenty9Room.schema";
import { get29Game1stPhaseCards } from "../../cards";

export default async function distributeFirstPhaseCards(
  room: ITwenty9RoomDocument,
  io: Server
) {
  room.cardDistributions = get29Game1stPhaseCards();
  room.gamePhase = "firstPhaseCardsDistributed";
  await room.save();

  room.players.forEach((player) => {
    const playerFirstHandCards =
      room.cardDistributions.find(
        (cardDistribution) => cardDistribution.playerId === player.playerId
      )?.cards || [];

    const data: {
      myPlayerId: 1 | 2 | 3 | 4;
      cards: ICard[];
      cardCounts: ICardCounts;
    } = {
      myPlayerId: player.playerId,
      cards: playerFirstHandCards,
      cardCounts: [
        { playerId: 1, count: 4 },
        { playerId: 2, count: 4 },
        { playerId: 3, count: 4 },
        { playerId: 4, count: 4 },
      ],
    };

    io.to(player.clerkId).emit(SocketEvent.TWENTY9_FIRST_PHASE_CARDS, data);
  });
}
