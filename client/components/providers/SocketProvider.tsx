"use client";

import { IPlayer } from "@/@types/game";
import {
  CreateTwenty9RoomFormSchemaType,
  JoinTwenty9RoomFormSchemaType,
} from "@/@types/schema";
import { RoomType, SocketEvent, SocketUser } from "@/@types/socket";
import SocketContext from "@/context/SocketContext";
import {
  clearSocketListeners,
  handleSocketEvents,
  initializeSocket,
} from "@/services/socket";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { ReactNode, useCallback, useEffect, useMemo, useState } from "react";
import { Socket } from "socket.io-client";

export default function SocketProvider({
  children,
}: {
  children: Readonly<ReactNode>;
}) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [room, setRoom] = useState<RoomType | null>(null);

  const { user } = useUser();
  const router = useRouter();

  const socketUser: SocketUser | null = useMemo(() => {
    if (!user) return null;

    return {
      id: user.id,
      name:
        user.fullName ||
        user.username ||
        user.firstName ||
        user.lastName ||
        user.id,
      imageUrl: user.imageUrl,
    };
  }, [user]);

  useEffect(() => {
    if (socketUser) {
      const _socket = initializeSocket(socketUser);
      handleSocketEvents(_socket, {
        setIsConnected,
        setRoom,
        router,
      });
      setSocket(_socket);

      return () => {
        clearSocketListeners(_socket);
        _socket.disconnect();
        setSocket(null);
      };
    }
  }, [socketUser, router]);

  const createTwenty9Room = useCallback(
    (data: CreateTwenty9RoomFormSchemaType) => {
      if (socket && socketUser) {
        socket.emit(SocketEvent.CREATETWENTY9ROOM, data);
      }
    },
    [socket, socketUser]
  );

  const joinTwenty9Room = useCallback(
    (data: JoinTwenty9RoomFormSchemaType) => {
      if (socket && socketUser) {
        socket.emit(SocketEvent.JOINTWENTY9ROOM, data);
      }
    },
    [socket, socketUser]
  );

  const leaveTwenty9Room = useCallback(() => {
    if (socket && room) {
      socket.emit(SocketEvent.LEAVETWENTY9ROOM, { roomCode: room.roomCode });
    }
  }, [socket, room]);

  const deleteTwenty9Room = useCallback(() => {
    if (socket && room && room.isMeRoomAdmin) {
      socket.emit(SocketEvent.DELETETWENTY9ROOM, { roomCode: room.roomCode });
    }
  }, [socket, room]);

  const addPlayerToAdminTeam_twenty9Room = useCallback(
    (player: IPlayer) => {
      if (
        socket &&
        room &&
        room.isTeamGame &&
        room.isMeRoomAdmin &&
        room.players.length === 4
      ) {
        socket.emit(SocketEvent.ADDPLAYERTOADMINTEAM_TWENTY9ROOM, {
          roomCode: room.roomCode,
          player,
        });
      }
    },
    [socket, room]
  );

  return (
    <SocketContext.Provider
      value={{
        socket,
        isConnected,
        room,
        createTwenty9Room,
        joinTwenty9Room,
        leaveTwenty9Room,
        deleteTwenty9Room,
        addPlayerToAdminTeam_twenty9Room,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
}
