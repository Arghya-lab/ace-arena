import { Server } from "http";
import { Server as SocketServer } from "socket.io";
import { SessionSocket, SocketEvent } from "../@types/socket";
import {
  addPlayerToAdminTeam_twenty9Room,
  createTwenty9Room,
  deleteTwenty9Room,
  doubleChallenge,
  joinTwenty9Room,
  leaveTwenty9Room,
  onSocketConnect,
  onSocketDisconnect,
  redoubleChallenge,
  startTwenty9game,
  trumpSuiteSelect,
  twenty9Bid,
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
      SocketEvent.CREATE_TWENTY9_ROOM,
      createTwenty9Room.bind({ socket, io })
    );

    //  join twenty9 room event //
    socket.on(
      SocketEvent.JOIN_TWENTY9_ROOM,
      joinTwenty9Room.bind({ socket, io })
    );

    //  leave twenty9 room event //
    socket.on(
      SocketEvent.LEAVE_TWENTY9_ROOM,
      leaveTwenty9Room.bind({ socket, io })
    );

    //  delete twenty9 room event by admin //
    socket.on(
      SocketEvent.DELETE_TWENTY9_ROOM,
      deleteTwenty9Room.bind({ socket, io })
    );

    //  add player to admin team twenty9 room event by admin //
    socket.on(
      SocketEvent.ADD_PLAYER_TO_ADMIN_TEAM_TWENTY9_ROOM,
      addPlayerToAdminTeam_twenty9Room.bind({ socket, io })
    );

    //  start twenty9 game event by admin //
    socket.on(
      SocketEvent.START_TWENTY9_GAME,
      startTwenty9game.bind({ socket, io })
    );

    //  twenty9 game bid by player //
    socket.on(SocketEvent.TWENTY9_BID, twenty9Bid.bind({ socket, io }));

    //  twenty9 game double challenge by bid winner opposition //
    socket.on(
      SocketEvent.TWENTY9_DOUBLE_CHALLENGE,
      doubleChallenge.bind({ socket, io })
    );

    //  twenty9 game re-double challenge by bid winner if opposition is challenge //
    socket.on(
      SocketEvent.TWENTY9_REDOUBLE_CHALLENGE,
      redoubleChallenge.bind({ socket, io })
    );

    //  twenty9 game re-double challenge by bid winner if opposition is challenge //
    socket.on(
      SocketEvent.TWENTY9_TRUMP_SUIT_SELECT,
      trumpSuiteSelect.bind({ socket, io })
    );

    // handle bid winner select trump suite => distribute second phase cards
  });
}
