import { IPlayerCards, SuitsEnum, TrumpOptionsEnum } from "./card";

export interface IUserSchema {
  clerkId: string;
  name: string;
  imageUrl: string;
  isRoomAdmin: boolean;
  teamId: "A" | "B" | "C" | "D";
  playerId: 1 | 2 | 3 | 4;
}

export interface ITwenty9RoomSchema {
  roomCode: string;
  isTeamGame: boolean;
  players: IUserSchema[];
  isSeventhCardEnable: boolean;
  isDoubleRedoubleEnable: boolean;
  cardDistributer: 1 | 2 | 3 | 4;
  firstBidder?: IUserSchema;
  secondBidder?: IUserSchema;
  highestBid: number;
  highestBidderId: 1 | 2 | 3 | 4 | null;
  totalParticipateBidder: number;
  isBidPassEnable: boolean;
  doubleChallengeBy: IUserSchema[];
  doubleChallengeEvaluated: 0 | 1 | 2;
  isDouble: boolean;
  isRedouble: boolean;
  trumpSuit: TrumpOptionsEnum | null;
  isTrumpSuitRevealed: boolean;
  cardDistributions: IPlayerCards[];
  gamePhase:
    | "uninitialized" //  game not started
    | "firstPhaseCardsDistributed" // first phase cards distributed but not yet bidding started
    | "bided" // bided by players and bidding winner and game winning point is known but trump suite is not selected
    | "trumpSelected" // trump suite is selected but second phase cards not started distributed
    | "secondPhaseCardsDistributed" // second phase cards distributed but players not stated to lead the trick
    | "initialized"; // finally players are leads tricks
  getAvailableBids: (option?: {
    isFirstBidder?: boolean;
  }) => (number | "pass")[];
}
