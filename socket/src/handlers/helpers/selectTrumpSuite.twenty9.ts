import { shuffle } from "lodash";
import { Server } from "socket.io";
import {
  SeventhCardEnum,
  SuitsEnum,
  TrumpOptionsEnum,
} from "../../@types/card";
import { SocketEvent } from "../../@types/socket";
import { ITwenty9RoomDocument } from "../../schema/twenty9Room.schema";
import sendNotification from "./sendNotification.main";

export default async function selectTrumpSuite(
  room: ITwenty9RoomDocument,
  io: Server
) {
  // if joker allowed in room then do according to that

  const highestBidder = room.players.find(
    (player) => player.playerId === room.highestBidderId
  );
  const suiteOptions: TrumpOptionsEnum[] = shuffle(Object.values(SuitsEnum));

  if (highestBidder) {
    if (room.isSeventhCardEnable) {
      //  if seventh card enable then add demo 7th card also
      suiteOptions.push(SeventhCardEnum.SEVENTH);
    }

    io.to(highestBidder.clerkId).emit(
      SocketEvent.DO_TWENTY9_TRUMP_SUIT_SELECT,
      {
        suiteOptions,
      }
    );

    sendNotification({
      io,
      socketRooms: room.roomCode,
      type: "Twenty9_Trump_Suit_selection",
      message: `Trump suit selecting by ${highestBidder.name}.`,
    });
  } else {
    sendNotification({
      io,
      socketRooms: room.roomCode,
      type: "Error",
      message: "Error occur : highestBidder not found.",
    });
  }
}
