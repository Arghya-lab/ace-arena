"use client";

import { RoomType } from "@/@types/socket";
import PlayerRoomJoinPoster from "@/components/PlayerRoomJoinPoster";
import { Button } from "@/components/ui/button";
import { TypographyH2, TypographyH4 } from "@/components/ui/typography";
import useSocket from "@/hooks/useSocket";
import cn from "@/utils/cn";
import { AnimatePresence } from "framer-motion";
import { LogOut, SquarePlay, Trash2 } from "lucide-react";

function PlayerJoinDashboard({
  room,
  startTwenty9Game,
}: {
  room: RoomType;
  startTwenty9Game: () => any;
}) {
  const { leaveTwenty9Room, deleteTwenty9Room } = useSocket();
  return (
    <div className="h-[calc(100dvh-56px)] min-h-[560px] overflow-y-auto p-4">
      <TypographyH2 className="py-4 text-center">
        Online Multiplayer
      </TypographyH2>
      {room.roomCode && (
        <TypographyH4 className="text-center">
          Room code:{" "}
          <span className="font-mono tracking-wide text-cyan-500">
            {room.roomCode}
          </span>
        </TypographyH4>
      )}
      <div className="flex flex-wrap justify-center gap-4 pb-16 pt-20">
        <AnimatePresence>
          {room.players.map((player) => (
            <PlayerRoomJoinPoster key={player.clerkId} player={player} />
          ))}
          {Array.from({ length: 4 - room.players.length }).map((i, id) => (
            <PlayerRoomJoinPoster key={id} />
          ))}
        </AnimatePresence>
      </div>
      <div className={cn({ "grid grid-cols-3": room && room.isMeRoomAdmin })}>
        {room && !room.isMeRoomAdmin && (
          <Button variant="destructive" onClick={leaveTwenty9Room}>
            <LogOut size={16} /> Leave
          </Button>
        )}
        {room && room.isMeRoomAdmin && (
          <>
            <Button
              className="place-self-center"
              variant="destructive"
              onClick={deleteTwenty9Room}
            >
              <Trash2 size={16} /> Delete
            </Button>
            <Button
              className="place-self-center"
              disabled={room.players.length !== 4}
              onClick={startTwenty9Game}
            >
              <SquarePlay size={16} /> Start Match
            </Button>
          </>
        )}
      </div>
    </div>
  );
}

export default PlayerJoinDashboard;
