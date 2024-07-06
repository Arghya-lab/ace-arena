import { Server } from "http";
import { Server as SocketServer } from "socket.io";
import { ISocketUser, SocketEvent } from "../@types/socket";
import Twenty9Room from "../models/Twenty9Room.model";
import genRoomCode from "../utils/genRoomCode";
import { GameEnum } from "../@types/game";

export default function socketInit(server: Server) {
  // Create server io
  const io = new SocketServer(server, {
    cors: {
      origin: "*",
    },
  });

  io.on("connect", (socket) => {
    const userId = (socket.handshake.query?.userId || "") as string;
    console.log(
      `New socket Connected socketId: ${socket.id}, userId: ${userId}`
    );
    socket.join(userId);

    socket.on("disconnect", () => {
      socket.leave(userId);
      console.log(
        `Socket disconnected socketId: ${socket.id}, userId: ${userId}`
      );
    });

    //***********          Socket events          ***********//
    //  create twenty9 room event //
    socket.on(
      SocketEvent.CREATETWENTY9ROOM,
      async ({
        user,
        payload,
      }: {
        user: ISocketUser;
        payload: {
          seventhCard?: boolean;
          doubleRedouble?: boolean;
        };
      }) => {
        try {
          const newRoom = await Twenty9Room.create({
            roomCode: genRoomCode(6),
            isSeventhCardEnable: payload?.seventhCard,
            isDoubleRedoubleEnable: payload?.doubleRedouble,
            players: [
              {
                clerkId: user.id,
                name: user.name,
                imageUrl: user.imageUrl,
                isRoomAdmin: true,
              },
            ],
          });

          socket.join(newRoom._id.toString());

          io.to(user.id).emit(
            SocketEvent.ROOMJOIN,
            {
              gameType: GameEnum.TWENTY9,
              roomCode: newRoom.roomCode,
              isRoomAdmin: true,
            },
            () => {
              // Emit PLAYERSINROOM event after ROOMJOIN event is acknowledged
              io.to(newRoom._id.toString()).emit(
                SocketEvent.PLAYERSINROOM,
                newRoom.players
              );
            }
          );
        } catch {
          console.error("Error creating room.");
        }
      }
    );

    //  join twenty9 room event //
    socket.on(
      SocketEvent.JOINTWENTY9ROOM,
      async ({
        user,
        payload,
      }: {
        user: ISocketUser;
        payload: {
          roomCode: string;
        };
      }) => {
        try {
          let room = await Twenty9Room.findOne({ roomCode: payload.roomCode });

          if (room) {
            const isAlreadyInRoom = room.players.find(
              (player) => player.clerkId === user.id
            );
            const isEmptySpotPresent = room.players.length < 4;

            if (!isAlreadyInRoom && isEmptySpotPresent) {
              room = await Twenty9Room.findOneAndUpdate(
                { roomCode: payload.roomCode },
                {
                  $push: {
                    players: {
                      clerkId: user.id,
                      name: user.name,
                      imageUrl: user.imageUrl,
                    },
                  },
                },
                { new: true }
              );
            }

            if (room && (isEmptySpotPresent || isAlreadyInRoom)) {
              socket.join(room._id.toString());

              io.to(user.id).emit(
                SocketEvent.ROOMJOIN,
                {
                  gameType: GameEnum.TWENTY9,
                  roomCode: room.roomCode,
                  isRoomAdmin: false,
                },
                () => {
                  // Emit PLAYERSINROOM event after ROOMJOIN event is acknowledged
                  io.to(room!._id.toString()).emit(
                    SocketEvent.PLAYERSINROOM,
                    room!.players
                  );
                }
              );
            }
          }
        } catch (error) {
          console.error("Error joining room.");
        }
      }
    );

    //  leave twenty9 room event //
    socket.on(
      SocketEvent.LEAVETWENTY9ROOM,
      async ({
        user,
        payload,
      }: {
        user: ISocketUser;
        payload: {
          roomCode: string;
        };
      }) => {
        try {
          const room = await Twenty9Room.findOne({
            roomCode: payload.roomCode,
            "players.clerkId": user.id,
            "players.isRoomAdmin": false,
          });

          if (room) {
            const updatedRoom = await Twenty9Room.findByIdAndUpdate(
              room._id,
              {
                $pull: { players: { clerkId: user.id } },
              },
              { new: true }
            );

            if (updatedRoom) {
              if (updatedRoom.players.length === 0) {
                await Twenty9Room.findByIdAndDelete(room._id);
              }

              socket.leave(room._id.toString());
              io.to(user.id).emit(SocketEvent.ROOMLEAVE);

              io.to(room._id.toString()).emit(
                SocketEvent.PLAYERSINROOM,
                updatedRoom.players
              );
            }
          }
        } catch (error) {
          console.error("Error leaving room.");
        }
      }
    );

    //  delete twenty9 room event by admin //
    socket.on(
      SocketEvent.DELETETWENTY9ROOM,
      async ({
        user,
        payload,
      }: {
        user: ISocketUser;
        payload: {
          roomCode: string;
        };
      }) => {
        try {
          const room = await Twenty9Room.findOne({
            roomCode: payload.roomCode,
            "players.clerkId": user.id,
            "players.isRoomAdmin": true,
          });

          if (room) {
            Twenty9Room.findByIdAndDelete(room._id).then(() => {
              io.in(room._id.toString()).socketsLeave(room._id.toString());
              io.to(room.players.map((player) => player.clerkId)).emit(
                SocketEvent.ROOMLEAVE
              );
            });
          }
        } catch (error) {
          console.error("Error deleting room.");
        }
      }
    );
  });
}
