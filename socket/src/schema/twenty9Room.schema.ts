import { Document, Schema } from "mongoose";
import { ITwenty9RoomSchema } from "../@types/schema";
import userSchema from "./user.schema";
import cardSchema from "./card.schema";

export interface ITwenty9RoomDocument extends ITwenty9RoomSchema, Document {}

const twenty9RoomSchema = new Schema<ITwenty9RoomDocument>({
  roomCode: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  isTeamGame: {
    type: Boolean,
    default: false,
  },
  players: { type: [userSchema], default: [] },
  isSeventhCardEnable: {
    type: Boolean,
    default: false,
  },
  isDoubleRedoubleEnable: {
    type: Boolean,
    default: false,
  },
  cardDistributer: {
    type: Number,
    enum: [1, 2, 3, 4],
    default: null,
  },
  firstBidder: userSchema,
  secondBidder: userSchema,
  highestBid: {
    type: Number,
    default: 16,
  },
  highestBidderId: {
    type: Number,
    enum: [1, 2, 3, 4],
    default: null,
  },
  totalParticipateBidder: {
    type: Number,
    default: 0,
  },
  isBidPassEnable: {
    type: Boolean,
    default: false,
  },
  doubleChallengeBy: {
    type: [userSchema],
    default: [],
  },
  doubleChallengeEvaluated: {
    type: Number,
    enum: [0, 1, 2],
    default: 0,
  },
  isDouble: {
    type: Boolean,
    default: false,
  },
  isRedouble: {
    type: Boolean,
    default: false,
  },
  trumpSuit: {
    type: String,
    default: null,
  },
  isTrumpSuitRevealed: {
    type: Boolean,
    default: false,
  },
  cardDistributions: [
    {
      playerId: {
        type: Number,
        enum: [1, 2, 3, 4],
        required: true,
      },
      cards: { type: [cardSchema], required: true },
    },
  ],
  gamePhase: {
    type: String,
    enum: [
      "uninitialized", //  game not started
      "firstPhaseCardsDistributed", // first phase cards distributed but not yet bidding started
      "bided", // bided by players and bidding owner and game winning point is known but trump suite is not selected
      "trumpSelected", // trump suite is selected but second phase cards not started distributed
      "secondPhaseCardsDistributed", // second phase cards distributed but players not stated to lead the trick
      "initialized", // finally players are leads tricks
    ],
    default: "uninitialized",
  },
});

twenty9RoomSchema.methods.getAvailableBids = function (option?: {
  isFirstBidder?: boolean;
}) {
  let availableBids: (number | "pass")[] = Array.from({
    length: 28 - this.highestBid,
  })
    .fill(0)
    .map((val, id) => (val = this.highestBid + id + 1));

  if (option?.isFirstBidder) {
    availableBids.unshift(this.highestBid);
  }

  if (!this.isBidPassEnable) return availableBids; // means first time bidding. only on first time bidding pass is not available

  availableBids.push("pass");
  return availableBids;
};

export default twenty9RoomSchema;
