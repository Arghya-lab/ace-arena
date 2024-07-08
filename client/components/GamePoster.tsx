"use client";

import { IGame } from "@/@types/game";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import cn from "@/utils/cn";
import Image from "next/image";
import Link from "next/link";
import { TypographyH3 } from "./ui/typography";

function GamePoster({ game }: { game: IGame }) {
  return (
    <div
      key={game.id}
      className="relative mx-4 mb-6 mt-2 w-64 max-w-[calc(100dvh-1rem)] overflow-hidden rounded-lg border pt-48"
    >
      <Image
        src={game.posterUrl}
        alt={game.name}
        width={256}
        height={(256 * 3) / 4}
        className="absolute left-0 top-0 h-48 w-64"
      />
      <TypographyH3 className="text-pretty p-4 pb-6 text-center">
        {game.name}
      </TypographyH3>
      <div className="px-4 pb-8">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-56">
              Play {game.name}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-56">
            {game.tables.map((table, idx) => (
              <ul key={table.name}>
                <li
                  className={cn(
                    "block py-1",
                    idx < game.tables.length - 1 && "border-b"
                  )}
                >
                  <Link
                    className="underline-offset-3 hover:underline"
                    href={table.playingUrl}
                  >
                    {table.name}
                  </Link>
                </li>
              </ul>
            ))}
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}

export default GamePoster;
