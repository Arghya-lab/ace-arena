import GamePoster from "@/components/GamePoster";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TypographyH1 } from "@/components/ui/typography";
import games from "@/games";

export default function Home() {
  return (
    <ScrollArea className="h-full">
      <TypographyH1 className="px-4">Free Online Card Games</TypographyH1>
      <section className="flex flex-wrap justify-center overflow-y-auto pt-2">
        {games.map((game) => (
          <GamePoster key={game.id} game={game} />
        ))}
      </section>
    </ScrollArea>
  );
}
