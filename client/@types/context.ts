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
