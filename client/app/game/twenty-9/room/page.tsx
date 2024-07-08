"use client";

import { ICard } from "@/@types/card";
import { SocketEvent } from "@/@types/socket";
import useSocket from "@/hooks/useSocket";
import { redirect } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import PlayerJoinDashboard from "./PlayerJoinDashboard";

function Twenty9RoomPage() {
  const { room, socket } = useSocket();
  if (!room) redirect("/game/twenty-9/play-with-friends");
  if (!socket) redirect("/");

  const [gamePhase, setGamePhase] = useState<
    | "uninitialized" //  game not started
    | "firstPhaseCardsDistributed" // first phase cards distributed but not yet bidding started
    | "bided" // bided by players and bidding owner and game winning point is known but trump suite is not selected
    | "trumpSelected" // trump suite is selected but second phase cards not started distributed
    | "secondPhaseCardsDistributed" // second phase cards distributed but players not stated to lead the trick
    | "initialized"
  >("uninitialized");
  const [inHandCards, setInHandCards] = useState<ICard[]>([]);

  useEffect(() => {
    function onTwenty9FirstHand(payload: ICard[]) {
      setInHandCards(payload);
      setGamePhase("firstPhaseCardsDistributed");
      console.log(payload);
    }

    socket.on(SocketEvent.TWENTY9FIRSTHAND, onTwenty9FirstHand);
    return () => {
      socket.off(SocketEvent.TWENTY9FIRSTHAND);
    };
  }, [socket]);

  const startTwenty9Game = useCallback(() => {
    if (socket && room && room.isMeRoomAdmin && room.players.length === 4) {
      socket.emit(SocketEvent.STARTTWENTY9GAME, { roomCode: room.roomCode });
    }
  }, [socket, room]);

  switch (gamePhase) {
    case "uninitialized":
      return (
        <PlayerJoinDashboard room={room} startTwenty9Game={startTwenty9Game} />
      );

    default:
      return <p>Hello</p>;
  }
}

export default Twenty9RoomPage;
