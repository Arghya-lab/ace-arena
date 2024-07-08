import { Schema } from "mongoose";
import { IUserSchema } from "../@types/schema";

const userSchema = new Schema<IUserSchema>({
  clerkId: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  isRoomAdmin: {
    type: Boolean,
    default: false,
  },
  teamId: {
    type: String,
    enum: ["A", "B", "C", "D"],
    required: true,
  },
  playerId: {
    type: Number,
    enum: [1, 2, 3, 4],
    required: true,
    unique: true,
  },
});

export default userSchema;
