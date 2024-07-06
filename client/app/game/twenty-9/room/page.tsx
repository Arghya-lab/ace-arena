"use client";

import { useSocket } from "@/components/providers/SocketProvider";
import RoomPlayerCard from "@/components/RoomPlayerCard";
import { Button } from "@/components/ui/button";
import { TypographyH2, TypographyH4 } from "@/components/ui/typography";
import { cn } from "@/lib/utils";
import { AnimatePresence } from "framer-motion";
import { LogOut, SquarePlay, Trash2 } from "lucide-react";
import { redirect } from "next/navigation";

function Twenty9RoomPage() {
  const { room, leaveTwenty9Room, deleteTwenty9Room } = useSocket();

  if (!room) redirect("/");

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
            <RoomPlayerCard key={player.clerkId} player={player} />
          ))}
          {Array.from({ length: 4 - room.players.length }).map((i, id) => (
            <RoomPlayerCard key={id} />
          ))}
        </AnimatePresence>
      </div>
      <div className={cn({ "grid grid-cols-3": room && room.isRoomAdmin })}>
        {room && !room.isRoomAdmin && (
          <Button variant="destructive" onClick={leaveTwenty9Room}>
            <LogOut size={16} /> Leave
          </Button>
        )}
        {room && room.isRoomAdmin && (
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
            >
              <SquarePlay size={16} /> Start Match
            </Button>
          </>
        )}
      </div>
    </div>
  );
}

export default Twenty9RoomPage;
