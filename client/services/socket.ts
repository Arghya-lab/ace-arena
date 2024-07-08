"client only";

import { GameEnum, IPlayer } from "@/@types/game";
import { RoomType, SocketEvent, SocketUser } from "@/@types/socket";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { Dispatch, SetStateAction } from "react";
import { io, Socket } from "socket.io-client";

export function initializeSocket(socketUser: SocketUser) {
  return io(process.env.NEXT_PUBLIC_SOCKET_SERVER_URL!, {
    query: socketUser,
  });
}

export function handleSocketEvents(
  socket: Socket,
  {
    setIsConnected,
    setRoom,
    router,
  }: {
    setIsConnected: Dispatch<SetStateAction<boolean>>;
    setRoom: Dispatch<SetStateAction<RoomType | null>>;
    router: AppRouterInstance;
  }
) {
  function onConnect() {
    setIsConnected(true);
  }

  function onDisconnect() {
    setIsConnected(false);
  }

  function onRoomJoin({
    gameType,
    roomCode,
    isMeRoomAdmin,
    isTeamGame,
  }: {
    gameType: GameEnum;
    roomCode: string;
    isMeRoomAdmin: boolean;
    isTeamGame: true;
  }) {
    setRoom({ roomCode, isMeRoomAdmin, isTeamGame, players: [] });
    switch (gameType) {
      case GameEnum.TWENTY9:
        router.push("/game/twenty-9/room");
        break;

      default:
        break;
    }
  }

  function onRoomLeave(payload: IPlayer[]) {
    setRoom(null);
  }

  function onPlayersInRoom(payload: IPlayer[]) {
    setRoom((prev) => (prev ? { ...prev, players: payload } : prev));
  }

  socket.on("connect", onConnect);
  socket.on("disconnect", onDisconnect);
  socket.on(SocketEvent.ROOMJOIN, onRoomJoin);
  socket.on(SocketEvent.ROOMLEAVE, onRoomLeave);
  socket.on(SocketEvent.PLAYERSINROOM, onPlayersInRoom);
}

export function clearSocketListeners(socket: Socket) {
  socket.off("connect");
  socket.off("disconnect");
  socket.off(SocketEvent.ROOMJOIN);
  socket.off(SocketEvent.ROOMLEAVE);
  socket.off(SocketEvent.PLAYERSINROOM);
}
