"use client";

import { Button } from "@/components/ui/button";
import { TypographyH4 } from "@/components/ui/typography";
import { AnimatePresence, motion } from "framer-motion";
import { useTwenty9RoomState } from "./Twenty9RoomProvider";

function ChallengeBoard() {
  const {
    currentChallenge,
    doubleChallengeBy,
    availableChallengePayload,
    handleChallenge,
  } = useTwenty9RoomState();

  return (
    <AnimatePresence>
      {currentChallenge && (
        <motion.div
          key={currentChallenge}
          className="fixed inset-0 z-[100] bg-black/40"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 sm:max-w-[425px] sm:rounded-lg">
            {currentChallenge === "redouble" ? (
              <TypographyH4 className="pb-4 text-center">
                Double challenge by{" "}
                {doubleChallengeBy?.map((player) => player.name).join(", ") ||
                  "opposition"}{" "}
                want to redouble it.
              </TypographyH4>
            ) : null}
            <div className="grid grid-cols-2 justify-items-center gap-4">
              {availableChallengePayload.map((payload) => (
                <Button
                  key={payload}
                  variant="outline"
                  onClick={() => handleChallenge(currentChallenge, payload)}
                >
                  {payload}
                </Button>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default ChallengeBoard;
