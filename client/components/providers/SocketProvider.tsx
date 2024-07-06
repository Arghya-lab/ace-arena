"use client";

import { GameEnum, IPlayer } from "@/@types/game";
import {
  CreateTwenty9RoomFormSchemaType,
  JoinTwenty9RoomFormSchemaType,
} from "@/@types/schema";
import {
  RoomType,
  SocketContextType,
  SocketEvent,
  SocketUser,
} from "@/@types/socket";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { io, Socket } from "socket.io-client";

const defaultValues = {
  isConnected: false,
  room: null,
  createTwenty9Room: (data: CreateTwenty9RoomFormSchemaType) => {},
  joinTwenty9Room: (data: JoinTwenty9RoomFormSchemaType) => {},
  leaveTwenty9Room: () => {},
  deleteTwenty9Room: () => {},
};

export const SocketContext = createContext<SocketContextType>(defaultValues);

export const useSocket = () => useContext(SocketContext);

function SocketProvider({ children }: { children: Readonly<ReactNode> }) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [room, setRoom] = useState<RoomType | null>(null);
  const { user } = useUser();
  const router = useRouter();

  const socketUser: SocketUser | null = useMemo(() => {
    if (user) {
      return {
        id: user.id,
        name:
          user.fullName ||
          user.username ||
          user.firstName ||
          "" + user.lastName ||
          "",
        imageUrl: user.imageUrl,
      };
    } else {
      return null;
    }
  }, [user]);

  useEffect(() => {
    function onConnect() {
      setIsConnected(true);
    }

    function onDisconnect() {
      setIsConnected(false);
    }

    function onRoomJoin({
      gameType,
      roomCode,
      isRoomAdmin,
    }: {
      gameType: GameEnum;
      roomCode: string;
      isRoomAdmin: boolean;
    }) {
      setRoom({ roomCode, isRoomAdmin, players: [] });
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

    if (user) {
      const _socket = io(process.env.SOCKET_SERVER_URL!, {
        query: { userId: user.id },
      });
      setSocket(_socket);

      // Socket events
      _socket.on("connect", onConnect);
      _socket.on("disconnect", onDisconnect);

      _socket.on(SocketEvent.ROOMJOIN, onRoomJoin);
      _socket.on(SocketEvent.ROOMLEAVE, onRoomLeave);
      _socket.on(SocketEvent.PLAYERSINROOM, onPlayersInRoom);

      return () => {
        _socket.off("connect");
        _socket.off("disconnect");

        _socket.off(SocketEvent.ROOMJOIN);
        _socket.off(SocketEvent.PLAYERSINROOM);

        _socket.disconnect();
        setSocket(null);
      };
    }
  }, [user, router]);

  const createTwenty9Room = useCallback(
    (data: CreateTwenty9RoomFormSchemaType) => {
      if (socket && socketUser) {
        socket.emit(SocketEvent.CREATETWENTY9ROOM, {
          user: socketUser,
          payload: data,
        });
      }
    },
    [socket, socketUser]
  );

  const joinTwenty9Room = useCallback(
    (data: JoinTwenty9RoomFormSchemaType) => {
      if (socket && socketUser) {
        socket.emit(SocketEvent.JOINTWENTY9ROOM, {
          user: socketUser,
          payload: data,
        });
      }
    },
    [socket, socketUser]
  );

  const leaveTwenty9Room = useCallback(() => {
    if (socket && room) {
      socket.emit(SocketEvent.LEAVETWENTY9ROOM, {
        user: socketUser,
        payload: { roomCode: room.roomCode },
      });
    }
  }, [socket, socketUser, room]);

  const deleteTwenty9Room = useCallback(() => {
    if (socket && room && room.isRoomAdmin) {
      socket.emit(SocketEvent.DELETETWENTY9ROOM, {
        user: socketUser,
        payload: { roomCode: room.roomCode },
      });
    }
  }, [socket, socketUser, room]);

  return (
    <SocketContext.Provider
      value={{
        isConnected,
        room,
        createTwenty9Room,
        joinTwenty9Room,
        leaveTwenty9Room,
        deleteTwenty9Room,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
}

export default SocketProvider;
