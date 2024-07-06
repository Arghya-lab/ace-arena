import { Schema } from "mongoose";
import { ITwenty9RoomSchema } from "../@types/schema";
import userSchema from "./user.schema";

export interface ITwenty9RoomDocument extends ITwenty9RoomSchema, Document {}

const twenty9RoomSchema = new Schema<ITwenty9RoomDocument>({
  roomCode: {
    type: String,
    required: true,
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
});
export default twenty9RoomSchema;
