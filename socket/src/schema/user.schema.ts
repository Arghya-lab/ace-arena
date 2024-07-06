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
});

export default userSchema;
