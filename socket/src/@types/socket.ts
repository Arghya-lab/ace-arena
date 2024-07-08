import { Socket } from "socket.io";

export interface ISocketUser {
  id: string;
  name: string;
  imageUrl: string;
}

export interface SessionSocket extends Socket {
  session?: ISocketUser;
}

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

  // server created events
  ROOMJOIN = "event:roomJoin",
  ROOMLEAVE = "event:roomLeave",
  PLAYERSINROOM = "event:playersInRoom",
  TWENTY9FIRSTHAND = "event:twenty9FirstHand",
}
