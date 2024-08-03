"use client";

import { ICard, ICardCounts } from "@/@types/card";
import { IPlayer } from "@/@types/game";
import usePageSize from "@/hooks/usePageSize";
import {cn} from "@/utils/cn";
import sortCards from "@/utils/sortCards";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import Card from "./Card";
import OppHandCards from "./OppHandCards";
import { Button } from "./ui/button";

function GameTable({
  myPlayerId,
  players,
  cards,
  cardCounts,
  playableCardIds,
  isMyTurn,
  onCardClick
}: {
  myPlayerId: 1 | 2 | 3 | 4;
  players: IPlayer[];
  cards: ICard[];
  cardCounts: ICardCounts;
  playableCardIds: number[];
  isMyTurn:boolean;
  onCardClick: (selectCard: ICard) => any
}) {
  const [inHandCards, setInHandCards] = useState(cards);
  const [isCardSorted, setIsCardSorted] = useState(false);
  const { pageHeight } = usePageSize();

  const totalCards = inHandCards.length;

  const leftSidePlayerCardCount = cardCounts.filter(
    (cc) => cc.playerId - myPlayerId === 1 || myPlayerId - cc.playerId === 3
  )[0].count;
  const frontSidePlayerCardCount = cardCounts.filter(
    (cc) => Math.abs(cc.playerId - myPlayerId) === 2
  )[0].count;
  const rightSidePlayerCardCount = cardCounts.filter(
    (cc) => cc.playerId - myPlayerId === 3 || myPlayerId - cc.playerId === 1
  )[0].count;

  const handleCardClick = (card: ICard) => {
    onCardClick(card);
    setInHandCards((prev) =>
      prev.filter((preCard) => preCard.id !== card.id)
    );
};

  return (
    <div className="relative h-full w-full">
      {/* my hand */}
      <div
        className="absolute bottom-0 flex h-56 w-full max-w-[1024px] justify-center py-8 md:h-56 lg:left-[calc(50%-32rem)]"
        style={{
          transform: "translate-3d(-50%, 0,0)",
        }}
      >
        {!isCardSorted && (
          <Button
            className="absolute bottom-4 right-4 z-[85]"
            onClick={() => {
              setInHandCards((prev) => sortCards(prev));
              setIsCardSorted(true);
            }}
          >
            sort
          </Button>
        )}
        <AnimatePresence>
          {inHandCards.map((card, id) => (
            <motion.div
              key={card.id}
              className={cn("absolute select-none", {
                "cursor-pointer": playableCardIds.includes(card.id),
              })}
              whileHover={{ y: playableCardIds.includes(card.id) ? -16 : 16 }}
              initial={{ rotate: 0, zIndex: 20 }}
              animate={{
                rotate:
                  (totalCards > 8 ? 4.8 : 3) *
                    2 *
                    (id - Math.ceil(totalCards / 2) + 1) -
                  Math.min(1.5 * totalCards, 8),
                zIndex: 20 + id * 5,
                x: id * 16,
                y: 16,
                transition: { duration: 0.5 },
              }}
              style={{ transformOrigin: "bottom left" }}
              exit={{
                x: 0,
                y: -((pageHeight - 56) / 2),
                rotate: 0,
                scale: 0.75,
              }}
              onClick={() => handleCardClick(card)}
            >
              <Card card={card} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      {/* left side player hand */}
      <OppHandCards
        totalCards={leftSidePlayerCardCount}
        position="left"
        player={players.find(
          (player) => (player.playerId + 1) % 4 === myPlayerId
        )}
      />
      {/* front side player hand */}
      <OppHandCards
        totalCards={frontSidePlayerCardCount}
        position="front"
        player={players.find(
          (player) => (player.playerId + 2) % 4 === myPlayerId
        )}
      />
      {/* right side player hand */}
      <OppHandCards
        totalCards={rightSidePlayerCardCount}
        position="right"
        player={players.find(
          (player) => (player.playerId + 3) % 4 === myPlayerId
        )}
      />
    </div>
  );
}

export default GameTable;
