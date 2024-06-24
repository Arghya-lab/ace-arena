"use client";

import { ICard } from "@/@types/card";
import { get29Game1stHandCards, get29Game2ndHandCards } from "@/cards";
import Cards from "@/components/HandCards";
import Card from "@/components/ui/Card";
import { Button } from "@/components/ui/button";
import { useState } from "react";

function HomePage() {
  const [firstHand, setFirstHand] = useState<ICard[]>([]);
  const [secondHand, setSecondHand] = useState<ICard[]>([]);
  const [isSecondHandHidden, setIsSecondHandHidden] = useState(true);

  return (
    <main className="relative h-screen min-h-[560px] overflow-hidden">
      <Button
        onClick={() => {
          // const firstHand = getGameCards();
          // console.log(firstHand);
          const firstHand = get29Game1stHandCards();
          setFirstHand(firstHand[0].cards);
          const secondHand = get29Game2ndHandCards(firstHand);
          // console.log(secondHand);
          setSecondHand(secondHand[0].cards);
          setIsSecondHandHidden(true);
        }}
      >
        distribute
      </Button>
      <Button
        disabled={!isSecondHandHidden}
        onClick={() => {
          setIsSecondHandHidden(false);
          setFirstHand((prev) => [...prev, ...secondHand]);
        }}
      >
        show
      </Button>
      <Card />
      {firstHand.length > 0 && (
        <Cards cards={firstHand} isAllCardGiven={!isSecondHandHidden} />
      )}
    </main>
  );
}

export default HomePage;
