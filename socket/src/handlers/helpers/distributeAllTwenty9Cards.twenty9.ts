import { Server } from "socket.io";
import {
  ICard,
  ICardCounts,
  IPlayerCard,
  SeventhCardEnum,
} from "../../@types/card";
import { IUserSchema } from "../../@types/schema";
import { SocketEvent } from "../../@types/socket";
import { get29GameCards } from "../../cards";
import { ITwenty9RoomDocument } from "../../schema/twenty9Room.schema";

export default async function distributeAllTwenty9Cards(
  room: ITwenty9RoomDocument,
  io: Server
) {
  room.cardDistributions = get29GameCards(room.cardDistributions);
  room.gamePhase = "secondPhaseCardsDistributed";
  room.prevTrickWinnerId = (room.cardDistributer % 4) + 1 as 1 | 2 | 3 | 4;
  await room.save();

  room.players.forEach((player) => {
    const playerCards = (
      room.cardDistributions.find(
        (cardDistribution) => cardDistribution.playerId === player.playerId
      ) as IPlayerCard
    ).cards;

    const data: {
      myPlayerId: 1 | 2 | 3 | 4;
      cards: ICard[];
      cardCounts: ICardCounts;
    } = {
      myPlayerId: player.playerId,
      cards: playerCards,
      cardCounts: [
        { playerId: 1, count: 8 },
        { playerId: 2, count: 8 },
        { playerId: 3, count: 8 },
        { playerId: 4, count: 8 },
      ],
    };

    io.to(player.clerkId).emit(SocketEvent.TWENTY9_ALL_CARDS, data);
  });

  if (room.isSeventhCardEnable && room.trumpSuit === SeventhCardEnum.SEVENTH) {
    //  If bid winner can select 7th card and choose 7th card => find 7th card and emit event to bid winner
    room.trumpSuit = (
      room.cardDistributions.find(
        (deck) => deck.playerId === room.highestBidderId
      ) as IPlayerCard
    ).cards[6].suit;
    await room.save();

    //  send to bid winner
    const highestBidder = room.players.find(
      (player) => player.playerId === room.highestBidderId
    ) as IUserSchema;

    io.to(highestBidder.clerkId).emit(SocketEvent.TWENTY9_TRUMP_SUIT, {
      trumpSuit: room.trumpSuit,
    });
  }

  // start of tricks
  const playerToPlayCard = room.players.find(
    (player) => player.playerId === room.prevTrickWinnerId
  ) as IUserSchema;
  const playableCardIds = (
    room.cardDistributions.find(
      (cd) => cd.playerId === playerToPlayCard.playerId
    ) as IPlayerCard
  ).cards.map((card) => card.id);
  io.to(playerToPlayCard.clerkId).emit(SocketEvent.DO_PLAY_TWENTY9_TRICK_CARD, {
    playableCardIds,
  });
}
