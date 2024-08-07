import { Server } from "socket.io";
import { IUserSchema } from "../../@types/schema";
import { SessionSocket, SocketEvent } from "../../@types/socket";
import Twenty9Room from "../../models/Twenty9Room.model";
import sendNotification from "../helpers/sendNotification.main";

export default async function addPlayerToAdminTeam_twenty9Room(
  this: { socket: SessionSocket; io: Server },
  payload: {
    roomCode: string;
    player: IUserSchema & { _id: string };
  }
) {
  const io = this.io;
  const session = this.socket.session;

  if (session && payload.player.teamId !== "A") {
    try {
      let room = await Twenty9Room.findOne({
        roomCode: payload.roomCode,
        "players.clerkId": payload.player.clerkId,
      });

      if (room) {
        const prevAdminTeamMate = room.players.find(
          (player) => player.teamId === "A" && !player.isRoomAdmin
        );
        const newAdminTeamMate = room.players.find(
          (player) => player.clerkId === payload.player.clerkId
        );

        if (
          prevAdminTeamMate &&
          newAdminTeamMate &&
          room.players.length === 4
        ) {
          room.players = [
            ...room.players.filter((player) => player.isRoomAdmin), // admin
            { ...newAdminTeamMate, teamId: "A", playerId: 3 }, // new admin partner with updated team and player id
            {
              ...room.players.filter(
                (player) =>
                  !player.isRoomAdmin &&
                  player.clerkId !== payload.player.clerkId &&
                  player.clerkId !== prevAdminTeamMate.clerkId
              )[0],
              playerId: 3,
            }, // unchanged admin opposition with updated player id
            { ...prevAdminTeamMate, teamId: "B", playerId: 4 }, // previous admin partner(now opposition) with updated team and player id
          ];
          await room.save();

          io.to(room.roomCode).emit(SocketEvent.PLAYERS_IN_ROOM, room.players);

          sendNotification({
            io,
            socketRooms: room.roomCode,
            type: "Join_Admin_Team",
            message: `${room.players[1].name} joined ${room.players[0].name}\`s team.`,
          });
        }
      }
    } catch (error) {
      console.error("Error changing player.");
    }
  }
}
