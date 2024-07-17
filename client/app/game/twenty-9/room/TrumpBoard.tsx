"use client";

import { Button } from "@/components/ui/button";
import { TypographyH3, TypographySmall } from "@/components/ui/typography";
import { AnimatePresence, motion } from "framer-motion";
import { Club, Diamond, Heart, Spade } from "lucide-react";
import { useTwenty9RoomState } from "./Twenty9RoomProvider";

function TrumpBoard() {
  const { canISelectTrump, trumpOptions, handleSelectTrump } =
    useTwenty9RoomState();

  return (
    <AnimatePresence>
      {canISelectTrump && (
        <motion.div
          className="fixed inset-0 z-[100] bg-black/40"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 sm:max-w-[425px] sm:rounded-lg">
            <TypographyH3 className="pb-4 text-center">
              Select a Trump card
            </TypographyH3>
            <div className="flex justify-center justify-items-center gap-4">
              {trumpOptions.map((option) => (
                <div key={option}>
                  <Button
                    variant="outline"
                    onClick={() => handleSelectTrump(option)}
                  >
                    {option === "Clubs" ? (
                      <Club />
                    ) : option === "Spades" ? (
                      <Spade />
                    ) : option === "Diamonds" ? (
                      <Diamond />
                    ) : option === "Hearts" ? (
                      <Heart />
                    ) : option === "Seventh" ? (
                      <TypographySmall>7 th</TypographySmall>
                    ) : null}
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default TrumpBoard;
