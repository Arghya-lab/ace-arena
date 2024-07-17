"use client";

import { Button } from "@/components/ui/button";
import { TypographyH3 } from "@/components/ui/typography";
import { AnimatePresence, motion } from "framer-motion";
import { useTwenty9RoomState } from "./Twenty9RoomProvider";

function BiddingBoard() {
  const { canIBid, availableBids, handleBid } = useTwenty9RoomState();

  return (
    <AnimatePresence>
      {canIBid && (
        <motion.div
          className="fixed inset-0 z-[100] bg-black/40"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 sm:max-w-[425px] sm:rounded-lg">
            <TypographyH3 className="pb-4 text-center">Make a Bid</TypographyH3>
            <div className="grid grid-cols-4 justify-items-center gap-4">
              {availableBids.map((bid) => (
                <Button
                  key={bid}
                  variant="outline"
                  className="h-14 w-full min-w-14"
                  onClick={() => handleBid(bid)}
                >
                  {bid}
                </Button>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default BiddingBoard;
