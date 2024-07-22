export type SocketUser = {
  id: string;
  name: string;
  imageUrl: string;
};

export enum SocketEvent {
  // client created events
  SHOW_ONLINE = "event:showOnline",
  SHOW_OFFLINE = "event:showOffline",

  CREATE_TWENTY9_ROOM = "event:createTwenty9Room",
  JOIN_TWENTY9_ROOM = "event:joinTwenty9Room",
  LEAVE_TWENTY9_ROOM = "event:leaveTwenty9Room",
  DELETE_TWENTY9_ROOM = "event:deleteTwenty9Room", // only room admin can delete the room
  ADD_PLAYER_TO_ADMIN_TEAM_TWENTY9_ROOM = "event:addPlayerToAdminTeam_twenty9Room", // only room admin can delete the room
  START_TWENTY9_GAME = "event:startTwenty9game", // only room admin can start the game
  TWENTY9_BID = "event:twenty9Bid",
  TWENTY9_DOUBLE_CHALLENGE = "event:twenty9DoubleChallenge",
  TWENTY9_REDOUBLE_CHALLENGE = "event:twenty9RedoubleChallenge",
  TWENTY9_TRUMP_SUIT_SELECT = "event:twenty9TrumpSuitSelect",

  // server created events
  NOTIFICATION = "event:notification",
  ROOM_JOIN = "event:roomJoin",
  ROOM_LEAVE = "event:roomLeave",
  PLAYERS_IN_ROOM = "event:playersInRoom",
  TWENTY9_FIRST_PHASE_CARDS = "event:twenty9FirstPhaseCards",
  DO_TWENTY9_BID = "event:doTwenty9Bid",
  TWENTY9_BID_CHANGE = "event:twenty9BidChange",
  DO_TWENTY9_DOUBLE_CHALLENGE = "event:doTwenty9DoubleChallenge",
  DO_TWENTY9_REDOUBLE_CHALLENGE = "event:doTwenty9RedoubleChallenge",
  TWENTY9_DOUBLE_REDOUBLE_CHANGE = "event:Twenty9DoubleRedoubleChange",
  DO_TWENTY9_TRUMP_SUIT_SELECT = "event:doTwenty9TrumpSuitSelect",
  TWENTY9_ALL_CARDS = "event:twenty9AllCards",
  TWENTY9_TRUMP_SUIT = "event:twenty9TrumpSuit",
}
export type NotificationType =
  | "Error"
  | "New_Room_Created"
  | "New_Player_Join"
  | "Player_leaves_Room"
  | "Room_Deleted"
  | "Join_Admin_Team"
  | "Twenty9_Bid"
  | "Twenty9_Bid_winner"
  | "Twenty9_Double_considering"
  | "Twenty9_Double_decision"
  | "Twenty9_Redouble_decision"
  | "Twenty9_Trump_Suit_selection"
  | "Twenty9_Trump_Suit_selected";
