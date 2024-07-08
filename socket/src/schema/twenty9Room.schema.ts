import { Schema } from "mongoose";
import { ITwenty9RoomSchema } from "../@types/schema";
import userSchema from "./user.schema";
import cardSchema from "./card.schema";

export type ITwenty9RoomDocument = ITwenty9RoomSchema & Document;

const twenty9RoomSchema = new Schema<ITwenty9RoomDocument>({
  roomCode: {
    type: String,
    required: true,
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
  cardDistributions: [
    {
      playerId: {
        type: Number,
        enum: [1, 2, 3, 4],
        required: true,
        unique: true,
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
export default twenty9RoomSchema;
