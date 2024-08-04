"use client";

import GameTable from "@/components/GameTable";
import { TypographyP, TypographySmall } from "@/components/ui/typography";
import useSocket from "@/hooks/useSocket";
import { motion } from "framer-motion";
import BiddingBoard from "./BiddingBoard";
import ChallengeBoard from "./ChallengeBoard";
import PlayerJoinDashboard from "./PlayerJoinDashboard";
import TrumpBoard from "./TrumpBoard";
import { useTwenty9RoomState } from "./Twenty9RoomProvider";

function Twenty9RoomPage() {
  const { room } = useSocket();
  const {
    gamePhase,
    cardCounts,
    myPlayerId,
    highestBid,
    highestBidder,
    isDouble,
    isRedouble,
    inHandCards,
    trumpSuit,
    playableCardIds,
    isMyTurn,
    isCardSorted,
    sortCards,
    onCardClick,
  } = useTwenty9RoomState();

  if (!room) return null;

  if (gamePhase === "uninitialized") {
    return <PlayerJoinDashboard />;
  }

  // if (gamePhase === "firstPhaseCardsGot" && cardCounts && myPlayerId) {
  if (cardCounts && myPlayerId) {
    return (
      <div className="relative h-full w-full">
        {highestBid && highestBidder && (
          <motion.div
            className="absolute right-2 top-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <TypographyP className="text-end">Bid: {highestBid}</TypographyP>
            <TypographySmall>Bidder: {highestBidder.name}</TypographySmall>
            <p />
            <TypographySmall>
              Double: {JSON.stringify(isDouble)}
            </TypographySmall>
            <p />
            <TypographySmall>
              Redouble: {JSON.stringify(isRedouble)}
            </TypographySmall>
            <p />
            <TypographySmall>Trump suit: {trumpSuit || "N/A"}</TypographySmall>
          </motion.div>
        )}
        <BiddingBoard />
        <ChallengeBoard />
        <TrumpBoard />
        <GameTable
          inHandCards={inHandCards}
          cardCounts={cardCounts}
          players={room.players}
          myPlayerId={myPlayerId}
          playableCardIds={playableCardIds}
          isMyTurn={isMyTurn}
          isCardSorted={isCardSorted}
          onCardClick={onCardClick}
          sortCards={sortCards}
        />
      </div>
    );
  }

  return <p>Hello</p>;
}

export default Twenty9RoomPage;
