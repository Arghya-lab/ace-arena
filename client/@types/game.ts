export interface IGameTable {
  name: string;
  playingUrl: string;
}

export interface IGame {
  id: number;
  name: string;
  posterUrl: string;
  tables: IGameTable[];
}

export enum GameEnum {
  TWENTY9 = "twenty9",
}

export interface IPlayer {
  _id: string;
  clerkId: string;
  name: string;
  imageUrl: string;
  isRoomAdmin: boolean;
  teamId: "A" | "B" | "C" | "D";
  playerId: 1 | 2 | 3 | 4;
}
