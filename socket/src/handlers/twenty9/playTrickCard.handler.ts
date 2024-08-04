import { Server } from "socket.io";
import { CardIdType, ICard, IPlayerCard } from "../../@types/card";
import { IUserSchema } from "../../@types/schema";
import { SessionSocket, SocketEvent } from "../../@types/socket";
import cardItems from "../../cards";
import Twenty9Room from "../../models/Twenty9Room.model";
import sendNotification from "../helpers/sendNotification.main";

export default async function playTrickCard(
  this: { socket: SessionSocket; io: Server },
  payload: {
    roomCode: string;
    cardId: number;
  }
) {
  const io = this.io;
  const session = this.socket.session;

  if (session) {
    try {
      const cardPlayed = cardItems.find((card) => card.id === payload.cardId);
      const room = await Twenty9Room.findOne({
        roomCode: payload.roomCode,
        "players.clerkId": session.id,
      });

      if (
        room &&
        room.gamePhase === "secondPhaseCardsDistributed" &&
        cardPlayed
      ) {
        const player = room.players.find(
          (player) => player.clerkId === session.id
        );

        if (
          player &&
          room.cardDistributions.find(
            (cardDistribution) =>
              cardDistribution.playerId === player.playerId &&
              cardDistribution.cardIds.find(
                (cardId) => cardId === payload.cardId
              )
          )
        ) {
          // if that particular player have that card in his/her deck
          room.currTrickCards.push({
            playerId: player.playerId,
            cardId: cardPlayed.id,
          });
          room.cardDistributions = room.cardDistributions
            .filter(
              (cardDistribution) =>
                cardDistribution.playerId !== player.playerId
            )
            .concat({
              playerId: player.playerId,
              cardIds: (
                room.cardDistributions.find(
                  (cardDistribution) =>
                    cardDistribution.playerId === player.playerId
                ) as IPlayerCard
              ).cardIds.filter((cardId) => cardId !== payload.cardId),
            });
          await room.save();

          if (room.currTrickCards.length === 4) {
            // end of current trick
            let trickWinnerId: 1 | 2 | 3 | 4;
            const firstPlayed = room.currTrickCards.find(
              (trickCard) => trickCard.playerId === room.prevTrickWinnerId
            ) as {
              playerId: 1 | 2 | 3 | 4;
              cardId: CardIdType;
            };
            const firstPlayedCard = cardItems.find(
              (card) => card.id === firstPlayed.cardId
            ) as ICard;
            const trickCards: {
              playerId: 1 | 2 | 3 | 4;
              card: ICard;
            }[] = room.currTrickCards.map(({ playerId, cardId }) => {
              const card = cardItems.find(
                (card) => card.id === cardId
              ) as ICard;
              return { playerId, card };
            });

            if (
              room.isTrumpSuitRevealed &&
              trickCards.find(
                (trickCard) => trickCard.card.suit === room.trumpSuit
              )
            ) {
              //  If trump card reveled and some one played
              trickWinnerId = trickCards.reduce(
                (prev, next) =>
                  prev.card["29GameCardRank"] > next.card["29GameCardRank"] ||
                  (prev.card.suit !== room.trumpSuit &&
                    next.card.suit === room.trumpSuit)
                    ? next
                    : prev,
                { playerId: firstPlayed.playerId, card: firstPlayedCard }
              ).playerId;
            } else {
              trickWinnerId = trickCards.reduce(
                (prev, next) =>
                  prev.card["29GameCardRank"] > next.card["29GameCardRank"]
                    ? next
                    : prev,
                { playerId: firstPlayed.playerId, card: firstPlayedCard }
              ).playerId;
            }
            const trickWinner = room.players.find(
              (player) => player.playerId === trickWinnerId
            ) as IUserSchema;

            //  Here team will either A or B
            if (trickWinner.teamId === "A") {
              room.ATeamTricksWonCardIds.push(
                ...room.currTrickCards.map((trickCard) => trickCard.cardId)
              );
            } else if (trickWinner.teamId === "B") {
              room.BTeamTricksWonCardIds.push(
                ...room.currTrickCards.map((trickCard) => trickCard.cardId)
              );
            }
            room.prevTrickWinnerId = trickWinnerId;
            room.currTrickCards = [];
            await room.save();

            io.to(room.roomCode).emit(SocketEvent.TWENTY9_TRICK_WINNER, {
              playerId: trickWinner.playerId,
            });

            const playableCardIds = (
              room.cardDistributions.find(
                (cd) => cd.playerId === trickWinner.playerId
              ) as IPlayerCard
            ).cardIds.map((cardId) => cardId);

            io.to(trickWinner.clerkId).emit(
              SocketEvent.DO_PLAY_TWENTY9_TRICK_CARD,
              { playableCardIds }
            );

            //  TODO: If player don't have cards end the game
          } else {
            //  emit event to next player for play his/her card
            const nextPlayer = room.players.find(
              (plr) => plr.playerId === (player.playerId % 4) + 1
            ) as IUserSchema;
            const nextPlayerCardIds = (
              room.cardDistributions.find(
                (cd) => cd.playerId === nextPlayer.playerId
              ) as IPlayerCard
            ).cardIds;
            const nextPlayerSameSuitCards = (
              nextPlayerCardIds.map((cardId) =>
                cardItems.find((card) => card.id === cardId)
              ) as ICard[]
            ).filter((card) => card.suit === cardPlayed.suit);
            const playableCardIds =
              nextPlayerSameSuitCards.length === 0
                ? nextPlayerCardIds
                : nextPlayerSameSuitCards.map((card) => card.id);

            io.to(nextPlayer.clerkId).emit(
              SocketEvent.DO_PLAY_TWENTY9_TRICK_CARD,
              { playableCardIds }
            );
          }
        } else if (player) {
          sendNotification({
            io,
            socketRooms: player.clerkId,
            type: "Error",
            message: "Invalid card",
          });
        }
      }
    } catch {
      console.log("Error occur in playing card card.");
    }
  }
}
