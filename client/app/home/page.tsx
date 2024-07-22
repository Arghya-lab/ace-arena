"use client";

import GamePoster from "@/components/GamePoster";
import { useAudio } from "@/components/providers/AudioProvider";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TypographyH1 } from "@/components/ui/typography";
import games from "@/games";

export default function Home() {
  const { playAudio } = useAudio();

  return (
    <ScrollArea className="h-full">
      <TypographyH1 className="px-4">Free Online Card Games</TypographyH1>
      <section className="flex flex-wrap justify-center overflow-y-auto pt-2">
        {games.map((game) => (
          <GamePoster key={game.id} game={game} />
        ))}
      </section>
      <Button variant="outline" onClick={() => playAudio("player-room-join")}>
        play1
      </Button>
      <Button variant="outline" onClick={() => playAudio("player-room-leave")}>
        play2
      </Button>
    </ScrollArea>
  );
}
