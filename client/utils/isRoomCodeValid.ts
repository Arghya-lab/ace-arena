export default async function isRoomCodeValid(roomCode: string) {
  const res = await fetch(`http://localhost:8000/is-twenty9-room/${roomCode}`);
  const data = await res.json();

  if (res.ok && data?.message) {
    return true;
  }
  return false;
}
