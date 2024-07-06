import { Model, model } from "mongoose";
import twenty9RoomSchema, {
  ITwenty9RoomDocument,
} from "../schema/twenty9Room.schema";

const Twenty9Room: Model<ITwenty9RoomDocument> = model<ITwenty9RoomDocument>(
  "Twenty9Room",
  twenty9RoomSchema
);

export default Twenty9Room;
