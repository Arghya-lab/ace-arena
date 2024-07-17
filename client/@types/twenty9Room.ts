import { Dispatch } from "react";
import { ICard, ICardCounts, SuitsEnum, TrumpOptionsEnum } from "./card";
import { IPlayer } from "./game";

export type ChallengeType = "double" | "redouble";
export type ChallengePayloadType = "double" | "redouble" | "pass";

export interface Twenty9RoomStateType {
  gamePhase:
    | "uninitialized" //  game not started
    | "firstPhaseCardsGot" // first phase cards got but not yet bidding started
    | "bided" // bided by players and bidding winner and game winning point is known but trump suite is not selected
    | "trumpSelected" // trump suite is selected but second phase cards not started got
    | "secondPhaseCardsGot" // second phase cards got but player not stated to lead the trick
    | "initialized"; // now players can leads tricks
  inHandCards: ICard[];
  cardCounts: ICardCounts | null;
  myPlayerId: 1 | 2 | 3 | 4 | null;
  canIBid: boolean;
  availableBids: (number | "pass")[];
  highestBid: number | null;
  highestBidder: IPlayer | null;
  currentChallenge: ChallengeType | null;
  availableChallengePayload: ChallengePayloadType[];
  doubleChallengeBy: IPlayer[] | null;
  isDouble: boolean;
  isRedouble: boolean;
  canISelectTrump: boolean;
  trumpOptions: TrumpOptionsEnum[];
  trumpSuit: SuitsEnum | null;
}

export interface Twenty9RoomContextType extends Twenty9RoomStateType {
  dispatch: Dispatch<Twenty9RoomActionType>;
  startTwenty9Game: () => void;
  handleBid: (bid: number | "pass") => void;
  handleChallenge: (
    challengeType: ChallengeType,
    payload: ChallengePayloadType
  ) => void;
  handleSelectTrump: (trumpSuit: TrumpOptionsEnum) => void;
}

//  reducer action types
interface FirstPhaseCardsActionType {
  type: "firstPhaseCards";
  payload: {
    myPlayerId: 1 | 2 | 3 | 4;
    cards: ICard[];
    cardCounts: ICardCounts;
  };
}
interface DoBidActionType {
  type: "doBid";
  payload: { availableBids: (number | "pass")[] };
}
interface BidChangeActionType {
  type: "bidChange";
  payload: { highestBid: number; highestBidder: IPlayer };
}
interface DoDoubleChallengeActionType {
  type: "doDoubleChallenge";
  payload: {
    options: ("double" | "pass")[];
  };
}
interface DoRedoubleChallengeActionType {
  type: "doRedoubleChallenge";
  payload: {
    doubleChallengeBy: IPlayer[];
    options: ("redouble" | "pass")[];
  };
}
interface DoubleRedoubleChangeActionType {
  type: "doubleRedoubleChange";
  payload: {
    isDouble?: boolean;
    isRedouble?: boolean;
  };
}
interface DoTrumpSuiteSelectActionType {
  type: "doTrumpSuiteSelect";
  payload: {
    suiteOptions: TrumpOptionsEnum[];
  };
}
interface removeBidActionType {
  type: "removeBid";
}
interface AddMyBidActionType {
  type: "addMyBid";
  payload: {
    highestBid: number;
    highestBidder: IPlayer;
  };
}
interface RemoveChallengeActionType {
  type: "removeChallenge";
}
interface SetAllCardsActionType {
  type: "setAllCards";
  payload: {
    myPlayerId: 1 | 2 | 3 | 4;
    cards: ICard[];
    cardCounts: ICardCounts;
  };
}
interface SetTrumpSuitActionType {
  type: "trumpSuit";
  payload: {
    trumpSuit: SuitsEnum;
  };
}
interface UserTrumpSelectActionType {
  type: "userTrumpSelect";
  payload: {trumpSuit: TrumpOptionsEnum}
}

export type Twenty9RoomActionType =
  | FirstPhaseCardsActionType
  | DoBidActionType
  | BidChangeActionType
  | DoDoubleChallengeActionType
  | DoRedoubleChallengeActionType
  | DoubleRedoubleChangeActionType
  | DoTrumpSuiteSelectActionType
  | removeBidActionType
  | AddMyBidActionType
  | RemoveChallengeActionType
  | SetAllCardsActionType
  | SetTrumpSuitActionType
  | UserTrumpSelectActionType;
