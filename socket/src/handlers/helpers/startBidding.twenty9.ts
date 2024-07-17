import { Server } from "socket.io";
import { ITwenty9RoomDocument } from "../../schema/twenty9Room.schema";
import { random } from "lodash";
import { ISocketUser, SocketEvent } from "../../@types/socket";

export default async function startBidding(
  room: ITwenty9RoomDocument,
  io: Server,
  session: ISocketUser
) {
  room.cardDistributer = random(1, 4) as 1 | 2 | 3 | 4;

  let firstBidder = room.players.find(
    (player) => player.playerId === (room.cardDistributer % 4) + 1
  );

  let secondBidder = room.players.find(
    (player) => player.playerId === ((room.cardDistributer + 1) % 4) + 1
  );

  if (firstBidder && secondBidder) {
    room.firstBidder = firstBidder;
    room.secondBidder = secondBidder;
    room.totalParticipateBidder = 2;
    await room.save();

    io.to(firstBidder.clerkId).emit(SocketEvent.DO_TWENTY9_BID, {
      availableBids: room.getAvailableBids({ isFirstBidder: true }),
    });
  }
}
