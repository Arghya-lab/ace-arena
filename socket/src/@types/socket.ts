export interface ISocketUser {
  id: string;
  name: string;
  imageUrl: string;
}

export enum SocketEvent {
  // client created events
  SHOWONLINE = "event:showOnline",
  SHOWOFFLINE = "event:showOffline",

  CREATETWENTY9ROOM = "event:createTwenty9Room",
  JOINTWENTY9ROOM = "event:joinTwenty9Room",
  LEAVETWENTY9ROOM = "event:leaveTwenty9Room",
  DELETETWENTY9ROOM = "event:deleteTwenty9Room",  // only room admin can delete the room

  // server created events
  ROOMJOIN = "event:roomJoin",
  ROOMLEAVE = "event:roomLeave",
  PLAYERSINROOM = "event:playersInRoom",
}
