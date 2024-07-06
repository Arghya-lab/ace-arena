import { Router } from "express";
import Twenty9Room from "../models/Twenty9Room.model";

const router = Router();

router.get("/health", (req, res) => {
  return res.status(200).end("Server is up and running.");
});

router.get("/is-twenty9-room/:roomCode", async (req, res) => {
  try {
    const roomCode = req.params?.roomCode;

    const room = await Twenty9Room.findOne({ roomCode });
    if (!room) {
      return res.status(400).json({ error: "Invalid room code." });
    }

    return res.status(200).json({ message: "It's a valid room code." });
  } catch {
    return res.status(500).json({ error: "Internal server error." });
  }
});

export default router;
