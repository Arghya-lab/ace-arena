"client only";

import { AudioPurpose } from "@/@types/audio";
import { RoomType } from "@/@types/context";
import { GameEnum, IPlayer } from "@/@types/game";
import { NotificationType, SocketEvent, SocketUser } from "@/@types/socket";
import { Toast, ToasterToast } from "@/hooks/useToast";
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
    playAudio,
    toast,
  }: {
    setIsConnected: Dispatch<SetStateAction<boolean>>;
    setRoom: Dispatch<SetStateAction<RoomType | null>>;
    router: AppRouterInstance;
    playAudio: (purpose: AudioPurpose) => void;
    toast: ({ ...props }: Toast) => {
      id: string;
      dismiss: () => void;
      update: (props: ToasterToast) => void;
    };
  }
) {
  function onConnect() {
    setIsConnected(true);
  }

  function onDisconnect() {
    setIsConnected(false);
  }

  function onNotification({
    type,
    message,
  }: {
    type?: NotificationType;
    message: string;
  }) {
    if(type=== "Error"){
      toast({ message, variant: "error" });
    }else if(type=== "New_Room_Created" || "New_Player_Join"){
      toast({ message, variant: "success" });
      playAudio("player-room-join");
    }else if(type=== "Player_leaves_Room"){
      toast({ message, variant: "warning" });
      playAudio("player-room-leave");
    }else if(type=== "Room_Deleted"){
      toast({ message, variant: "error" });
      playAudio("room-deleted");
    }else if(type=== "Join_Admin_Team"){
      playAudio("player-room-join");
    }else if(type=== "Twenty9_Bid"){
    }else if(type=== "Twenty9_Bid_winner" ||
      "Twenty9_Double_considering" ||
      "Twenty9_Double_decision" ||
      "Twenty9_Redouble_decision" ||
      "Twenty9_Trump_Suit_selection" ||
      "Twenty9_Trump_Suit_selected"){
        toast({ message, variant: "info" });
    }
  };

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
  socket.on(SocketEvent.NOTIFICATION, onNotification);
  socket.on(SocketEvent.ROOM_JOIN, onRoomJoin);
  socket.on(SocketEvent.ROOM_LEAVE, onRoomLeave);
  socket.on(SocketEvent.PLAYERS_IN_ROOM, onPlayersInRoom);
}

export function clearSocketListeners(socket: Socket) {
  socket.off("connect");
  socket.off("disconnect");
  socket.off(SocketEvent.NOTIFICATION);
  socket.off(SocketEvent.ROOM_JOIN);
  socket.off(SocketEvent.ROOM_LEAVE);
  socket.off(SocketEvent.PLAYERS_IN_ROOM);
}
