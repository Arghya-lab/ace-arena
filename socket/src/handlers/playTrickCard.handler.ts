import { Server } from "socket.io";
import { ICard, IPlayerCard } from "../@types/card";
import { IUserSchema } from "../@types/schema";
import { SessionSocket, SocketEvent } from "../@types/socket";
import cardItems from "../cards";
import Twenty9Room from "../models/Twenty9Room.model";
import sendNotification from "./helpers/sendNotification.main";

export default async function playTrickCard(
  this: { socket: SessionSocket; io: Server },
  payload: {
    roomCode: string;
    cardId: number|string;
  }
) {
  const io = this.io;
  const session = this.socket.session;

  if (session) {
    try {
      const cardPlayed = cardItems.find((card) => card.id === Number(payload.cardId));      
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
              cardDistribution.cards.find((card) => card.id === payload.cardId)
          )
        ) {
          // if that particular player have that card in his/her deck
          room.currTrickCards.push({
            playerId: player.playerId,
            card: cardPlayed,
          });
          room.cardDistributions = room.cardDistributions
            .filter(
              (cardDistribution) =>
                cardDistribution.playerId !== player.playerId
            )
            .concat({
              playerId: player.playerId,
              cards: (
                room.cardDistributions.find(
                  (cardDistribution) =>
                    cardDistribution.playerId === player.playerId
                ) as IPlayerCard
              ).cards.filter((card) => card.id !== payload.cardId),
            });       
          await room.save();

          if (room.currTrickCards.length === 4) {
            // end of current trick            
            const firstPlayedCard = room.currTrickCards.find(
              (trickCard) => trickCard.playerId === room.prevTrickWinnerId
            ) as {
              playerId: 1 | 2 | 3 | 4;
              card: ICard;
            };
            let trickWinnerId: 1 | 2 | 3 | 4;

            if (
              room.isTrumpSuitRevealed &&
              room.currTrickCards.find((cd) => cd.card.suit === room.trumpSuit)
            ) {
              //  If trump card reveled and some one played
              trickWinnerId = room.currTrickCards.reduce(
                (prev, next) =>
                  prev.card["29GameCardRank"] > next.card["29GameCardRank"] ||
                  (prev.card.suit !== room.trumpSuit &&
                    next.card.suit === room.trumpSuit)
                    ? next
                    : prev,
                firstPlayedCard
              ).playerId;
            } else {
              trickWinnerId = room.currTrickCards.reduce(
                (prev, next) =>
                  prev.card["29GameCardRank"] > next.card["29GameCardRank"]
                    ? next
                    : prev,
                firstPlayedCard
              ).playerId;
            }
            const trickWinner = room.players.find(
              (player) => player.playerId === trickWinnerId
            ) as IUserSchema;

            //  Here team will either A or B
            if (trickWinner.teamId === "A") {
              room.ATeamTricksWonCards.concat(
                room.currTrickCards.map((trickCard) => trickCard.card)
              );
            } else if (trickWinner.teamId === "B") {
              room.BTeamTricksWonCards.concat(
                room.currTrickCards.map((trickCard) => trickCard.card)
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
            ).cards.map((card) => card.id);

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
            const nextPlayerCards = (
              room.cardDistributions.find(
                (cd) => cd.playerId === nextPlayer.playerId
              ) as IPlayerCard
            ).cards;
            const nextPlayerSameSuitCards = nextPlayerCards.filter(
              (card) => card.suit === cardPlayed.suit
            );
            const playableCardIds =
              nextPlayerSameSuitCards.length === 0
                ? nextPlayerCards.map((card) => card.id)
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
