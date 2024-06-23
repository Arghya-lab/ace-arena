"use client";

import {
  get29Game1stDeckCards,
  get29Game2ndDeckCards,
} from "@/cards/utils/get29GameCards";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Button
        onClick={() => {
          const firstHand = get29Game1stDeckCards();
          console.log(firstHand);
          const secondHand = get29Game2ndDeckCards(firstHand);
          console.log(secondHand);
        }}
      >
        Hello world
      </Button>
    </main>
  );
}
