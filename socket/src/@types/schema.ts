export interface IUserSchema {
  clerkId: string;
  name: string;
  imageUrl: string;
  isRoomAdmin: boolean;
}

export interface ITwenty9RoomSchema {
  roomCode: string;
  players: IUserSchema[];
  isSeventhCardEnable: boolean;
  isDoubleRedoubleEnable: boolean;
}
