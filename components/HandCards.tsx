import { ICard } from "@/@types/card";
import sortCards from "@/cards/utils/sortCards";
import usePageSize from "@/hooks/usePageSize";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import Card from "./ui/Card";

function HandCards({
  cards,
  isAllCardGiven = true,
}: {
  cards: ICard[];
  isAllCardGiven?: boolean;
}) {
  const [inHandCards, setInHandCards] = useState(cards);
  const [isCardSorted, setIsCardSorted] = useState(false);
  const { pageHeight } = usePageSize();

  const totalCards = inHandCards.length;

  useEffect(() => {
    setInHandCards(cards);
  }, [cards]);

  const handleCardClick = (selectCard: ICard) => {
    setInHandCards((prev) =>
      prev.filter((preCard) => preCard.id !== selectCard.id)
    );
  };

  return (
    <div
      className="absolute bottom-0 flex h-56 w-full max-w-[1024px] justify-center py-8 md:h-72 lg:left-[calc(50%-512px)]"
      style={{
        transform: "translate-3d(-50%, 0,0)",
      }}
    >
      {!isCardSorted && isAllCardGiven && (
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
            className="absolute cursor-pointer select-none"
            whileHover={{ y: -16 }}
            initial={{ rotate: 0, zIndex: 20 }}
            animate={{
              rotate:
                (totalCards > 8 ? 4.8 : 3) *
                  2 *
                  (id - Math.ceil(totalCards / 2) + 1) -
                Math.min(1.5 * totalCards, 8),
              zIndex: 20 + id * 5,
              x: id * 16,
              transition: { duration: 0.5 },
            }}
            style={{ transformOrigin: "bottom left" }}
            exit={{
              x: 0,
              y: -(pageHeight / 2),
              rotate: 0,
              scale: 0.72,
              transformOrigin: "top left",
            }}
            onClick={() => handleCardClick(card)}
          >
            <Card card={card} />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

export default HandCards;
