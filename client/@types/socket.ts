import { Socket } from "socket.io-client";
import { IPlayer } from "./game";
import {
  CreateTwenty9RoomFormSchemaType,
  JoinTwenty9RoomFormSchemaType,
} from "./schema";

export interface RoomType {
  roomCode: string;
  isMeRoomAdmin: boolean;
  isTeamGame: boolean;
  players: IPlayer[];
}

export interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  room: RoomType | null;
  createTwenty9Room: (data: CreateTwenty9RoomFormSchemaType) => void;
  joinTwenty9Room: (data: JoinTwenty9RoomFormSchemaType) => void;
  leaveTwenty9Room: () => void;
  deleteTwenty9Room: () => void;
  addPlayerToAdminTeam_twenty9Room: (player: IPlayer) => void;
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
  ADDPLAYERTOADMINTEAM_TWENTY9ROOM = "event:addPlayerToAdminTeam_twenty9Room", // only room admin can delete the room
  STARTTWENTY9GAME = "event:startTwenty9game", // only room admin can start the game
  TWENTY9BID = "event:twenty9Bid",

  // server created events
  ROOMJOIN = "event:roomJoin",
  ROOMLEAVE = "event:roomLeave",
  PLAYERSINROOM = "event:playersInRoom",
  TWENTY9FIRSTHAND = "event:twenty9FirstHand",
  DOTWENTY9BID = "event:doTwenty9Bid",
  TWENTY9BIDCHANGE = "event:twenty9BidChange",
}
