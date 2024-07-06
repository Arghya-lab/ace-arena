import crypto from "crypto";

export default function genRoomCode(size = 6): string {
  return crypto.randomBytes(size / 2).toString("hex");
}
