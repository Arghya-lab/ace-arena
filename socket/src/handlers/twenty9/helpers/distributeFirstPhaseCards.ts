import { Server } from "socket.io";
import { CardIdType, ICardCounts, IPlayerCard } from "../../../@types/card";
import { SocketEvent } from "../../../@types/socket";
import { get29Game1stPhaseCards } from "../../../cards";
import { ITwenty9RoomDocument } from "../../../schema/twenty9Room.schema";

export default async function distributeFirstPhaseCards(
  room: ITwenty9RoomDocument,
  io: Server
) {
  room.cardDistributions = get29Game1stPhaseCards();
  room.gamePhase = "firstPhaseCardsDistributed";
  await room.save();

  room.players.forEach((player) => {
    const playerFirstHandCardIds =
      (room.cardDistributions.find(
        (cardDistribution) => cardDistribution.playerId === player.playerId
      ) as IPlayerCard).cardIds;

    const data: {
      myPlayerId: 1 | 2 | 3 | 4;
      cardIds: CardIdType[];
      cardCounts: ICardCounts;
    } = {
      myPlayerId: player.playerId,
      cardIds: playerFirstHandCardIds,
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
