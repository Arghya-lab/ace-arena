"use client";

import { ICard, ICardCounts, SuitsEnum, TrumpOptionsEnum } from "@/@types/card";
import { IPlayer } from "@/@types/game";
import { SocketEvent } from "@/@types/socket";
import {
  ChallengePayloadType,
  ChallengeType,
  Twenty9RoomContextType,
  Twenty9RoomStateType,
} from "@/@types/twenty9Room";
import useSocket from "@/hooks/useSocket";
import { useUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useReducer,
} from "react";
import reducer from "./reducer";

const initialTwenty9RoomState: Twenty9RoomStateType = {
  gamePhase: "uninitialized",
  inHandCards: [],
  cardCounts: null,
  myPlayerId: null,
  canIBid: false,
  availableBids: [],
  highestBid: null,
  highestBidder: null,
  currentChallenge: null,
  availableChallengePayload: [],
  doubleChallengeBy: null,
  isDouble: false,
  isRedouble: false,
  canISelectTrump: false,
  trumpOptions: [],
  trumpSuit: null,
  playableCardIds:[],
  isMyTurn:false
};

const Twenty9RoomContext = createContext<Twenty9RoomContextType>({
  ...initialTwenty9RoomState,
  dispatch: () => {},
  startTwenty9Game: () => {},
  handleBid: (bid: number | "pass") => {},
  handleChallenge: (
    challengeType: ChallengeType,
    payload: ChallengePayloadType
  ) => {},
  handleSelectTrump: (trumpSuit: TrumpOptionsEnum) => {},
  onCardClick: (card: ICard) => {}
});

export const useTwenty9RoomState = () => useContext(Twenty9RoomContext);

export function Twenty9RoomProvider({
  children,
}: {
  children: Readonly<ReactNode>;
}) {
  const { user } = useUser();
  const { room, socket } = useSocket();

  if (!room) redirect("/game/twenty-9/play-with-friends");
  if (!socket) redirect("/");

  const [state, dispatch] = useReducer(reducer, initialTwenty9RoomState);

  useEffect(() => {
    const onTwenty9FirstPhaseCards = (payload: {
      myPlayerId: 1 | 2 | 3 | 4;
      cards: ICard[];
      cardCounts: ICardCounts;
    }) => dispatch({ type: "firstPhaseCards", payload });

    const onDoTwenty9Bid = (payload: { availableBids: (number | "pass")[] }) =>
      dispatch({ type: "doBid", payload });

    const onTwenty9BidChange = (payload: {
      highestBid: number;
      highestBidder: IPlayer;
    }) => dispatch({ type: "bidChange", payload });

    const onDoTwenty9DoubleChallenge = (payload: {
      options: ("double" | "pass")[];
    }) => dispatch({ type: "doDoubleChallenge", payload });

    const onDoTwenty9RedoubleChallenge = (payload: {
      doubleChallengeBy: IPlayer[];
      options: ("redouble" | "pass")[];
    }) => dispatch({ type: "doRedoubleChallenge", payload });

    const onTwenty9DoubleRedoubleChange = (payload: {
      isDouble?: boolean;
      isRedouble?: boolean;
    }) => dispatch({ type: "doubleRedoubleChange", payload });

    const onDoTwenty9TrumpSuiteSelect = (payload: {
      suiteOptions: TrumpOptionsEnum[];
    }) => dispatch({ type: "doTrumpSuiteSelect", payload });

    const onTwenty9AllCards = (payload: {
      myPlayerId: 1 | 2 | 3 | 4;
      cards: ICard[];
      cardCounts: ICardCounts;
    }) => dispatch({ type: "setAllCards", payload });

    const onTrumpSuit = (payload: { trumpSuit: SuitsEnum }) =>
      dispatch({ type: "trumpSuit", payload });

    const onDoPlayTrickCard = (payload: { playableCardIds: number[] }) => {
      dispatch({type:"doPlayTrickCard", payload})
    };

    const onTrickWinner = (payload: { playerId: 1 | 2 | 3 | 4 }) => {
      console.log(payload);
    };

    socket.on(SocketEvent.TWENTY9_FIRST_PHASE_CARDS, onTwenty9FirstPhaseCards);
    socket.on(SocketEvent.DO_TWENTY9_BID, onDoTwenty9Bid);
    socket.on(SocketEvent.TWENTY9_BID_CHANGE, onTwenty9BidChange);
    socket.on(
      SocketEvent.TWENTY9_DOUBLE_REDOUBLE_CHANGE,
      onTwenty9DoubleRedoubleChange
    );
    socket.on(
      SocketEvent.DO_TWENTY9_DOUBLE_CHALLENGE,
      onDoTwenty9DoubleChallenge
    );
    socket.on(
      SocketEvent.DO_TWENTY9_REDOUBLE_CHALLENGE,
      onDoTwenty9RedoubleChallenge
    );
    socket.on(
      SocketEvent.DO_TWENTY9_TRUMP_SUIT_SELECT,
      onDoTwenty9TrumpSuiteSelect
    );
    socket.on(SocketEvent.TWENTY9_ALL_CARDS, onTwenty9AllCards);
    socket.on(SocketEvent.TWENTY9_TRUMP_SUIT, onTrumpSuit);
    socket.on(SocketEvent.DO_PLAY_TWENTY9_TRICK_CARD, onDoPlayTrickCard);
    socket.on(SocketEvent.TWENTY9_TRICK_WINNER, onTrickWinner);

    return () => {
      socket.off(SocketEvent.TWENTY9_FIRST_PHASE_CARDS);
      socket.off(SocketEvent.DO_TWENTY9_BID);
      socket.off(SocketEvent.TWENTY9_BID_CHANGE);
      socket.off(SocketEvent.TWENTY9_DOUBLE_REDOUBLE_CHANGE);
      socket.off(SocketEvent.DO_TWENTY9_DOUBLE_CHALLENGE);
      socket.off(SocketEvent.DO_TWENTY9_REDOUBLE_CHALLENGE);
      socket.off(SocketEvent.DO_TWENTY9_TRUMP_SUIT_SELECT);
      socket.off(SocketEvent.TWENTY9_ALL_CARDS);
      socket.off(SocketEvent.TWENTY9_TRUMP_SUIT);
      socket.off(SocketEvent.DO_PLAY_TWENTY9_TRICK_CARD);
      socket.off(SocketEvent.TWENTY9_TRICK_WINNER);
    };
  }, [socket]);

  const startTwenty9Game = useCallback(() => {
    if (socket && room && room.isMeRoomAdmin && room.players.length === 4) {
      socket.emit(SocketEvent.START_TWENTY9_GAME, { roomCode: room.roomCode });
    }
  }, [socket, room]);

  const handleBid = (bid: number | "pass") => {
    if (socket && room) {
      socket.emit(SocketEvent.TWENTY9_BID, { roomCode: room.roomCode, bid });

      if (bid === "pass") {
        dispatch({ type: "removeBid" });
      } else {
        const highestBidder = room.players.find(
          (player) => player.clerkId === user?.id
        );

        if (highestBidder) {
          dispatch({
            type: "addMyBid",
            payload: {
              highestBid: bid,
              highestBidder,
            },
          });
        }
      }
    }
  };

  const handleChallenge = (
    challengeType: ChallengeType,
    payload: ChallengePayloadType
  ) => {
    if (socket && room) {
      dispatch({ type: "removeChallenge" });
      if (challengeType === "double") {
        socket.emit(SocketEvent.TWENTY9_DOUBLE_CHALLENGE, {
          roomCode: room.roomCode,
          payload,
        });
      } else if (challengeType === "redouble") {
        socket.emit(SocketEvent.TWENTY9_REDOUBLE_CHALLENGE, {
          roomCode: room.roomCode,
          payload,
        });
      }
    }
  };

  const handleSelectTrump = (trumpSuit: TrumpOptionsEnum) => {
    if (socket && room) {
      socket.emit(SocketEvent.TWENTY9_TRUMP_SUIT_SELECT, {
        roomCode: room.roomCode,
        trumpSuit,
      });
      dispatch({ type: "userTrumpSelect", payload: { trumpSuit } });
    }
  };
  
  const onCardClick = (card: ICard) => {
    if (socket && room) {
      socket.emit(SocketEvent.PLAY_TWENTY9_TRICK_CARD, {
        roomCode: room.roomCode,
        cardId: card.id,
      });
      dispatch({ type: "playedTrickCard"});
    }
  };

  return (
    <Twenty9RoomContext.Provider
      value={{
        ...state,
        dispatch,
        startTwenty9Game,
        handleBid,
        handleChallenge,
        handleSelectTrump,
        onCardClick
      }}
    >
      {children}
    </Twenty9RoomContext.Provider>
  );
}
