import { SessionSocket } from "../@types/socket";

export default function onSocketConnect(socket: SessionSocket) {
  const { id, name, imageUrl } = socket.handshake.query;

  if (!id || !name || !imageUrl) {
    console.log("User data missing, disconnecting socket");

    socket.disconnect(true);
    return;
  }

  socket.session = {
    id: id as string,
    name: name as string,
    imageUrl: imageUrl as string,
  };

  socket.join(socket.session.id);

  console.log(
    `New socket Connected socketId: ${socket.id}, userId: ${socket.session.id}`
  );
}
