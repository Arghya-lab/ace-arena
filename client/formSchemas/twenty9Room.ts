import { z } from "zod";

export const JoinTwenty9RoomFormSchema = z.object({
  roomCode: z
    .string()
    .min(6, {
      message: "Room code must be 6 characters.",
    })
    .max(6, {
      message: "Room code must be 6 characters.",
    }),
});

export const CreateTwenty9RoomFormSchema = z.object({
  seventhCard: z.boolean().default(false).optional(),
  doubleRedouble: z.boolean().default(false).optional(),
});
