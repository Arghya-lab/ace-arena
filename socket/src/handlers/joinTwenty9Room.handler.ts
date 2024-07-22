import { difference } from "lodash";
import { Server } from "socket.io";
import { GameEnum } from "../@types/game";
import { SessionSocket, SocketEvent } from "../@types/socket";
import Twenty9Room from "../models/Twenty9Room.model";
import sendNotification from "./helpers/sendNotification.main";

export default async function joinTwenty9Room(
  this: { socket: SessionSocket; io: Server },
  payload: {
    roomCode: string;
  }
) {
  const io = this.io;
  const socket = this.socket;
  const session = this.socket.session;

  if (session) {
    try {
      let room = await Twenty9Room.findOne({ roomCode: payload.roomCode });

      if (room) {
        const isAlreadyInRoom = room.players.find(
          (player) => player.clerkId === session.id
        );
        const isEmptySpotPresent = room.players.length < 4;

        if (!isAlreadyInRoom && isEmptySpotPresent) {
          const totalPlayerInTeamA = room.players.filter(
            (player) => player.teamId === "A"
          ).length;

          const EmptyPlayerIdsInTeamA = difference(
            [1, 3],
            room.players
              .filter((player) => player.teamId === "A")
              .map((player) => player.playerId)
          );
          const EmptyPlayerIdsInTeamB = difference(
            [2, 4],
            room.players
              .filter((player) => player.teamId === "B")
              .map((player) => player.playerId)
          );

          room = await Twenty9Room.findOneAndUpdate(
            { roomCode: payload.roomCode },
            {
              $push: {
                players: {
                  clerkId: session.id,
                  name: session.name,
                  imageUrl: session.imageUrl,
                  isRoomAdmin: false,
                  teamId: totalPlayerInTeamA < 2 ? "A" : "B",
                  playerId:
                    EmptyPlayerIdsInTeamA.length > 0
                      ? EmptyPlayerIdsInTeamA[0]
                      : EmptyPlayerIdsInTeamB[0],
                },
              },
            },
            { new: true }
          );
        }

        if (room && (isEmptySpotPresent || isAlreadyInRoom)) {
          socket.join(room.roomCode);

          io.to(session.id).emit(
            SocketEvent.ROOM_JOIN,
            {
              gameType: GameEnum.TWENTY9,
              roomCode: room.roomCode,
              isMeRoomAdmin: false,
              isTeamGame: true,
            },
            () => {
              // Emit PLAYERSINROOM event after ROOMJOIN event is acknowledged
              io.to(room!.roomCode).emit(
                SocketEvent.PLAYERS_IN_ROOM,
                room!.players
              );
            }
          );

          const prevPlayersRoomId = room.players
            .filter((player) => player.clerkId !== session.id)
            .map((player) => player.clerkId);

          sendNotification({
            io,
            socketRooms: prevPlayersRoomId,
            type: "New_Player_Join",
            message: `New player ${session.name} join Twenty9 room.`,
          }); // notification for old players
          sendNotification({
            io,
            socketRooms: session.id,
            type: "New_Player_Join",
            message: `You successfully join to ${room.roomCode} Twenty9 room.`,
          }); // notification for new player
        }
      }
    } catch (error) {
      console.error("Error joining room.");
    }
  }
}
