import { Server } from "socket.io";
import { ITwenty9RoomDocument } from "../../schema/twenty9Room.schema";
import { SocketEvent } from "../../@types/socket";
import { shuffle } from "lodash";
import {
  SeventhCardEnum,
  SuitsEnum,
  TrumpOptionsEnum,
} from "../../@types/card";

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
  } else {
    console.log("Error occur : highestBidder not found.");
  }
}
