import { GameEnum } from "../@types/game";
import { SessionSocket, SocketEvent } from "../@types/socket";
import Twenty9Room from "../models/Twenty9Room.model";
import genRoomCode from "../utils/genRoomCode";
import { Server } from "socket.io";

export default async function createTwenty9Room(
  this: { socket: SessionSocket; io: Server },
  payload: {
    seventhCard?: boolean;
    doubleRedouble?: boolean;
  }
) {
  const io = this.io;
  const socket = this.socket;
  const session = this.socket.session;

  if (session) {
    try {
      let roomCode = genRoomCode(6);
      while (await Twenty9Room.findOne({ roomCode })) {
        //if room already exist with the room code then replace the room code
        roomCode = genRoomCode(6);
      }

      const newRoom = await Twenty9Room.create({
        roomCode,
        isTeamGame: true,
        isSeventhCardEnable: payload?.seventhCard,
        isDoubleRedoubleEnable: payload?.doubleRedouble,
        players: [
          {
            clerkId: session.id,
            name: session.name,
            imageUrl: session.imageUrl,
            isRoomAdmin: true,
            teamId: "A",
            playerId: 1,
          },
        ],
      });

      socket.join(newRoom.roomCode);

      this.io.to(session.id).emit(
        SocketEvent.ROOM_JOIN,
        {
          gameType: GameEnum.TWENTY9,
          roomCode: newRoom.roomCode,
          isMeRoomAdmin: true,
          isTeamGame: true,
        },
        () => {
          // Emit PLAYERSINROOM event after ROOMJOIN event is acknowledged
          io.to(newRoom.roomCode).emit(
            SocketEvent.PLAYERS_IN_ROOM,
            newRoom.players
          );
        }
      );
    } catch {
      console.error("Error creating room.");
    }
  }
}
