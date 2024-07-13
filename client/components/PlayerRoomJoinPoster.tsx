"use client";

import { IPlayer } from "@/@types/game";
import useSocket from "@/hooks/useSocket";
import { Star, UserPlus } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import {
  TypographyLarge,
  TypographyMuted,
  TypographySmall,
} from "./ui/typography";

function PlayerRoomJoinPoster({ player }: { player?: IPlayer }) {
  const { addPlayerToAdminTeam_twenty9Room, room } = useSocket();
  if (!room) return null;

  return (
    <div className="relative flex w-48 flex-col items-center rounded-xl border bg-card p-4 text-card-foreground shadow">
      {player && player.isRoomAdmin && (
        <div className="absolute left-2 top-2 z-10 -rotate-45 text-yellow-400">
          <Star fill="#facc15" />
        </div>
      )}
      {player ? (
        <>
          <Avatar className="h-32 w-32">
            <AvatarImage src={player.imageUrl} alt={player.name} />
            <AvatarFallback>
              {player.name
                .split(" ")
                .map((p) => p.slice(0, 1).toUpperCase())
                .join("")}
            </AvatarFallback>
          </Avatar>
          <TypographyLarge className="line-clamp-2 text-ellipsis text-wrap break-words pb-3 pt-4">
            {player.name.slice(0, 12)}
          </TypographyLarge>
          <TypographySmall className="pb-3">
            Team: {player.teamId}
          </TypographySmall>
          {room.isMeRoomAdmin &&
            room.players.length === 4 &&
            !player.isRoomAdmin &&
            player.teamId !== "A" && (
              <Button
                variant="outline"
                onClick={() => addPlayerToAdminTeam_twenty9Room(player)}
              >
                Add to my Team
              </Button>
            )}
        </>
      ) : (
        <div>
          <div className="flex h-32 w-32 items-center justify-center rounded-full">
            <UserPlus size={64} />
          </div>
          <TypographyMuted className="line-clamp-2 text-wrap pt-4 text-center">
            Waiting for join...
          </TypographyMuted>
        </div>
      )}
    </div>
  );
}

export default PlayerRoomJoinPoster;
