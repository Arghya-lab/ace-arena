import { ICard, IPlayerCard, TrumpOptionsEnum } from "./card";

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
  cardDistributions: IPlayerCard[];
  currTrickCards: {
    playerId: 1 | 2 | 3 | 4;
    card: ICard;
  }[];
  prevTrickWinnerId: 1 | 2 | 3 | 4 | null;
  ATeamTricksWonCards: ICard[];
  BTeamTricksWonCards: ICard[];
  gamePhase:
    | "uninitialized" //  game not started
    | "firstPhaseCardsDistributed" // first phase cards distributed but not yet bidding started
    | "bided" // bided by players and bidding winner and game winning point is known but trump suite is not selected
    | "trumpSelected" // trump suite is selected but second phase cards not started distributed
    | "secondPhaseCardsDistributed" // second phase cards distributed but finally players are leads tricks
    | "ended"; // match is end
  getAvailableBids: (option?: {
    isFirstBidder?: boolean;
  }) => (number | "pass")[];
}
