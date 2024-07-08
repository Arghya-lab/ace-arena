import { Server } from "http";
import { Server as SocketServer } from "socket.io";
import { SessionSocket, SocketEvent } from "../@types/socket";
import {
  addPlayerToAdminTeam_twenty9Room,
  createTwenty9Room,
  deleteTwenty9Room,
  joinTwenty9Room,
  leaveTwenty9Room,
  onSocketConnect,
  onSocketDisconnect,
  startTwenty9game,
} from "../handlers";

export default function socketInit(server: Server) {
  // Create server io
  const io = new SocketServer(server, {
    cors: {
      origin: "*",
    },
  });

  io.on("connect", (socket: SessionSocket) => {
    onSocketConnect(socket);

    socket.on("disconnect", onSocketDisconnect.bind({ socket, io }));

    //***********          Socket events          ***********//
    //  create twenty9 room event //
    socket.on(
      SocketEvent.CREATETWENTY9ROOM,
      createTwenty9Room.bind({ socket, io })
    );

    //  join twenty9 room event //
    socket.on(
      SocketEvent.JOINTWENTY9ROOM,
      joinTwenty9Room.bind({ socket, io })
    );

    //  leave twenty9 room event //
    socket.on(
      SocketEvent.LEAVETWENTY9ROOM,
      leaveTwenty9Room.bind({ socket, io })
    );

    //  delete twenty9 room event by admin //
    socket.on(
      SocketEvent.DELETETWENTY9ROOM,
      deleteTwenty9Room.bind({ socket, io })
    );

    //  add player to admin team twenty9 room event by admin //
    socket.on(
      SocketEvent.ADDPLAYERTOADMINTEAM_TWENTY9ROOM,
      addPlayerToAdminTeam_twenty9Room.bind({ socket, io })
    );

    //  start twenty9 game event by admin //
    socket.on(
      SocketEvent.STARTTWENTY9GAME,
      startTwenty9game.bind({ socket, io })
    );
  });
}
