import {
  CreateTwenty9RoomFormSchema,
  JoinTwenty9RoomFormSchema,
} from "@/formSchemas/twenty9Room";
import { z } from "zod";

export type CreateTwenty9RoomFormSchemaType = z.infer<
  typeof CreateTwenty9RoomFormSchema
>;

export type JoinTwenty9RoomFormSchemaType = z.infer<
  typeof JoinTwenty9RoomFormSchema
>;
