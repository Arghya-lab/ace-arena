import { IPlayer } from "@/@types/game";
import { Star, UserPlus } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { TypographyLarge, TypographyMuted } from "./ui/typography";

function RoomPlayerCard({ player }: { player?: IPlayer }) {
  return (
    <div className="relative flex h-64 w-48 flex-col items-center rounded-xl border bg-card p-4 text-card-foreground shadow">
      {player && player.isRoomAdmin && (
        <div className="absolute left-2 top-2 z-10 -rotate-45 text-yellow-400">
          <Star fill="#facc15" />
        </div>
      )}
      {player ? (
        <>
          <Avatar className="h-36 w-36">
            <AvatarImage src={player.imageUrl} alt={player.name} />
            <AvatarFallback>
              {player.name
                .split(" ")
                .map((p) => p.slice(0, 1).toUpperCase())
                .join("")}
            </AvatarFallback>
          </Avatar>
          <TypographyLarge className="line-clamp-2 text-wrap pt-4">
            {player.name}
          </TypographyLarge>
        </>
      ) : (
        <div>
          <div className="flex h-36 w-36 items-center justify-center rounded-full">
            <UserPlus size={64} />
          </div>
          <TypographyMuted className="text-center line-clamp-2 text-wrap pt-4">
            Waiting for join...
          </TypographyMuted>
        </div>
      )}
    </div>
  );
}

export default RoomPlayerCard;
