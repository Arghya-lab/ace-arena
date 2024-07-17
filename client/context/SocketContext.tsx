import { SocketContextType } from "@/@types/context";
import { IPlayer } from "@/@types/game";
import {
  CreateTwenty9RoomFormSchemaType,
  JoinTwenty9RoomFormSchemaType,
} from "@/@types/schema";
import { createContext } from "react";

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
  room: null,
  createTwenty9Room: (data: CreateTwenty9RoomFormSchemaType) => {},
  joinTwenty9Room: (data: JoinTwenty9RoomFormSchemaType) => {},
  leaveTwenty9Room: () => {},
  deleteTwenty9Room: () => {},
  addPlayerToAdminTeam_twenty9Room: (player: IPlayer) => {},
});

export default SocketContext;
