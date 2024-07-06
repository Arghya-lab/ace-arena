import { IPlayer } from "./game";
import {
  CreateTwenty9RoomFormSchemaType,
  JoinTwenty9RoomFormSchemaType,
} from "./schema";

export interface RoomType {
  roomCode: string;
  isRoomAdmin: boolean;
  players: IPlayer[];
}

export interface SocketContextType {
  isConnected: boolean;
  room: RoomType | null;
  createTwenty9Room: (data: CreateTwenty9RoomFormSchemaType) => void;
  joinTwenty9Room: (data: JoinTwenty9RoomFormSchemaType) => void;
  leaveTwenty9Room: () => void;
  deleteTwenty9Room: () => void;
}

export type SocketUser = {
  id: string;
  name: string;
  imageUrl: string;
};

export enum SocketEvent {
  // client created events
  SHOWONLINE = "event:showOnline",
  SHOWOFFLINE = "event:showOffline",

  CREATETWENTY9ROOM = "event:createTwenty9Room",
  JOINTWENTY9ROOM = "event:joinTwenty9Room",
  LEAVETWENTY9ROOM = "event:leaveTwenty9Room",
  DELETETWENTY9ROOM = "event:deleteTwenty9Room", // only room admin can delete the room

  // server created events
  ROOMJOIN = "event:roomJoin",
  ROOMLEAVE = "event:roomLeave",
  PLAYERSINROOM = "event:playersInRoom",
}
