"use client";

import { ICard, ICardCounts } from "@/@types/card";
import { IPlayer } from "@/@types/game";
import { SocketEvent } from "@/@types/socket";
import GameTable from "@/components/GameTable";
import { TypographyP, TypographySmall } from "@/components/ui/typography";
import useSocket from "@/hooks/useSocket";
import { useUser } from "@clerk/nextjs";
import { AnimatePresence, motion } from "framer-motion";
import { redirect } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import BiddingBoard from "./BiddingBoard";
import PlayerJoinDashboard from "./PlayerJoinDashboard";

function Twenty9RoomPage() {
  const { user } = useUser();
  const { room, socket } = useSocket();
  if (!room) redirect("/game/twenty-9/play-with-friends");
  if (!socket) redirect("/");

  const [gamePhase, setGamePhase] = useState<
    | "uninitialized" //  game not started
    | "firstPhaseCardsGot" // first phase cards got but not yet bidding started
    | "bided" // bided by players and bidding winner and game winning point is known but trump suite is not selected
    | "trumpSelected" // trump suite is selected but second phase cards not started got
    | "secondPhaseCardsGot" // second phase cards got but player not stated to lead the trick
    | "initialized" // now players can leads tricks
  >("uninitialized");
  const [inHandCards, setInHandCards] = useState<ICard[]>([]);
  const [cardCounts, setCardCounts] = useState<ICardCounts | null>(null);
  const [myPlayerId, setMyPlayerId] = useState<1 | 2 | 3 | 4 | null>(null);
  const [bid, setBid] = useState<{
    canIBid: boolean;
    availableBids: (number | "pass")[];
    highestBid?: number;
    highestBidder?: IPlayer;
  }>({
    canIBid: false,
    availableBids: [],
  });

  useEffect(() => {
    function onTwenty9FirstHand(payload: {
      myPlayerId: 1 | 2 | 3 | 4;
      cards: ICard[];
      cardCounts: ICardCounts;
    }) {
      setMyPlayerId(payload.myPlayerId);
      setInHandCards(payload.cards);
      setCardCounts(payload.cardCounts);
      setGamePhase("firstPhaseCardsGot");
    }

    function onDoTwenty9Bid(payload: { availableBids: (number | "pass")[] }) {
      setBid({ canIBid: true, availableBids: payload.availableBids });
    }

    function onTwenty9BidChange({
      highestBid,
      highestBidder,
    }: {
      highestBid: number;
      highestBidder: IPlayer;
    }) {
      setBid((prev) => ({ ...prev, highestBid, highestBidder }));
    }

    socket.on(SocketEvent.TWENTY9FIRSTHAND, onTwenty9FirstHand);
    socket.on(SocketEvent.DOTWENTY9BID, onDoTwenty9Bid);
    socket.on(SocketEvent.TWENTY9BIDCHANGE, onTwenty9BidChange);

    return () => {
      socket.off(SocketEvent.TWENTY9FIRSTHAND);
      socket.off(SocketEvent.TWENTY9FIRSTHAND);
      socket.off(SocketEvent.TWENTY9BIDCHANGE);
    };
  }, [socket]);

  const startTwenty9Game = useCallback(() => {
    if (socket && room && room.isMeRoomAdmin && room.players.length === 4) {
      socket.emit(SocketEvent.STARTTWENTY9GAME, { roomCode: room.roomCode });
    }
  }, [socket, room]);

  const handleBid = (bid: number | "pass") => {
    if (socket && room) {
      socket.emit(SocketEvent.TWENTY9BID, { roomCode: room.roomCode, bid });

      if (bid === "pass") {
        setBid({ availableBids: [], canIBid: false });
      } else {
        const highestBidder = room.players.find(
          (player) => player.clerkId === user?.id
        );

        if (highestBidder) {
          setBid({
            availableBids: [],
            canIBid: false,
            highestBid: bid,
            highestBidder,
          });
        }
      }
    }
  };

  if (gamePhase === "uninitialized") {
    return (
      <PlayerJoinDashboard room={room} startTwenty9Game={startTwenty9Game} />
    );
  }

  if (gamePhase === "firstPhaseCardsGot" && cardCounts && myPlayerId) {
    return (
      <div className="relative h-full w-full">
        <AnimatePresence>
          {bid.highestBid && bid.highestBidder && (
            <motion.div
              className="absolute right-2 top-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <TypographyP className="text-end">
                Bid: {bid.highestBid}
              </TypographyP>
              <TypographySmall>
                Bidder: {bid.highestBidder.name}
              </TypographySmall>
            </motion.div>
          )}
          {bid.canIBid && (
            <BiddingBoard
              availableBids={bid.availableBids}
              handleBid={handleBid}
            />
          )}
        </AnimatePresence>
        <GameTable
          cards={inHandCards}
          cardCounts={cardCounts}
          players={room.players}
          myPlayerId={myPlayerId}
          playableCardIds={[]}
        />
      </div>
    );
  }

  return <p>Hello</p>;
}

export default Twenty9RoomPage;
