import {
  Twenty9RoomActionType,
  Twenty9RoomStateType,
} from "@/@types/twenty9Room";

export default function reducer(
  prevState: Twenty9RoomStateType,
  action: Twenty9RoomActionType
): Twenty9RoomStateType {
  switch (action.type) {
    case "firstPhaseCards": {
      const { cardCounts, cards, myPlayerId } = action.payload;
      return {
        ...prevState,
        gamePhase: "firstPhaseCardsGot",
        inHandCards: cards,
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
      const { cardCounts, cards, myPlayerId } = action.payload;
      return {
        ...prevState,
        gamePhase: "secondPhaseCardsGot",
        inHandCards: cards,
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

    default:
      return prevState;
  }
}
