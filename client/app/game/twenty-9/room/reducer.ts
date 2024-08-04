import { ICard } from "@/@types/card";
import {
  Twenty9RoomActionType,
  Twenty9RoomStateType,
} from "@/@types/twenty9Room";
import cardItems from "@/cards";
import sortCards from "@/utils/sortCards";

export default function reducer(
  prevState: Twenty9RoomStateType,
  action: Twenty9RoomActionType
): Twenty9RoomStateType {
  switch (action.type) {
    case "firstPhaseCards": {
      const { cardCounts, cardIds, myPlayerId } = action.payload;
      const inHandCards = cardIds.map(
        (cardId) => cardItems.find((card) => card.id === cardId) as ICard
      );

      return {
        ...prevState,
        gamePhase: "firstPhaseCardsGot",
        inHandCards,
        myPlayerId,
        cardCounts,
      };
    }
    case "doBid": {
      const { availableBids } = action.payload;
      return { ...prevState, canIBid: true, availableBids };
    }
    case "bidChange": {
      const { highestBid, highestBidder } = action.payload;
      return { ...prevState, highestBid, highestBidder };
    }
    case "removeBid": {
      return {
        ...prevState,
        availableBids: [],
        canIBid: false,
      };
    }
    case "addMyBid": {
      return {
        ...prevState,
        availableBids: [],
        canIBid: false,
        highestBid: action.payload.highestBid,
        highestBidder: action.payload.highestBidder,
      };
    }
    case "doDoubleChallenge": {
      return {
        ...prevState,
        currentChallenge: "double",
        availableChallengePayload: action.payload.options,
      };
    }
    case "doRedoubleChallenge": {
      const { doubleChallengeBy, options } = action.payload;
      return {
        ...prevState,
        currentChallenge: "redouble",
        doubleChallengeBy,
        availableChallengePayload: options,
      };
    }
    case "doubleRedoubleChange": {
      const { isDouble, isRedouble } = action.payload;
      return {
        ...prevState,
        isDouble: isDouble ? isDouble : prevState.isDouble,
        isRedouble: isRedouble ? isRedouble : prevState.isRedouble,
      };
    }
    case "removeChallenge": {
      return {
        ...prevState,
        currentChallenge: null,
      };
    }
    case "doTrumpSuiteSelect": {
      const { suiteOptions } = action.payload;
      return {
        ...prevState,
        canISelectTrump: true,
        trumpOptions: suiteOptions,
      };
    }
    case "setAllCards": {
      const { cardCounts, cardIds, myPlayerId } = action.payload;
      const inHandCards = cardIds.map(
        (cardId) => cardItems.find((card) => card.id === cardId) as ICard
      );

      return {
        ...prevState,
        gamePhase: "secondPhaseCardsGot",
        inHandCards,
        myPlayerId,
        cardCounts,
      };
    }
    case "trumpSuit": {
      const { trumpSuit } = action.payload;
      return {
        ...prevState,
        trumpOptions: [],
        trumpSuit,
      };
    }
    case "userTrumpSelect": {
      const { trumpSuit } = action.payload;
      return {
        ...prevState,
        canISelectTrump: false,
        trumpOptions: [],
        trumpSuit: trumpSuit === "Seventh" ? null : trumpSuit,
      };
    }
    case "doPlayTrickCard": {
      const { playableCardIds } = action.payload;
      return {
        ...prevState,
        playableCardIds,
        isMyTurn: true,
      };
    }
    case "playedTrickCard": {
      const { cardId } = action.payload;
      return {
        ...prevState,
        inHandCards: prevState.inHandCards.filter(
          (preCard) => preCard.id !== cardId
        ),
        playableCardIds: [],
        isMyTurn: false,
      };
    }
    case "sortCards": {
      return {
        ...prevState,
        inHandCards: sortCards(prevState.inHandCards),
        isCardSorted: true,
      };
    }

    default:
      return prevState;
  }
}
