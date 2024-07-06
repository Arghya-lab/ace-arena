"use client";

import {
  CreateTwenty9RoomFormSchemaType,
  JoinTwenty9RoomFormSchemaType,
} from "@/@types/schema";
import { useSocket } from "@/components/providers/SocketProvider";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  TypographyH1,
  TypographyH4,
  TypographyMuted,
} from "@/components/ui/typography";
import {
  CreateTwenty9RoomFormSchema,
  JoinTwenty9RoomFormSchema,
} from "@/formSchemas/twenty9Room";
import isRoomCodeValid from "@/utils/isRoomCodeValid";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";

function Twenty9PlayWithFriendsPage() {
  const { createTwenty9Room, joinTwenty9Room } = useSocket();
  const [cardType, setCardType] = useState<"joinRoom" | "createRoom">(
    "joinRoom"
  );

  const joinRoomForm = useForm<JoinTwenty9RoomFormSchemaType>({
    resolver: zodResolver(JoinTwenty9RoomFormSchema),
    defaultValues: {
      roomCode: "",
    },
  });

  const createRoomForm = useForm<CreateTwenty9RoomFormSchemaType>({
    resolver: zodResolver(CreateTwenty9RoomFormSchema),
    defaultValues: {
      seventhCard: true,
      doubleRedouble: true,
    },
  });

  async function handleJoinRoom(data: JoinTwenty9RoomFormSchemaType) {
    if (!(await isRoomCodeValid(data.roomCode))) {
      joinRoomForm.setError("roomCode", { message: "Invalid room code." });
    }

    joinTwenty9Room(data);
  }
  function handleCreateRoom(data: CreateTwenty9RoomFormSchemaType) {
    createTwenty9Room(data);
  }

  return (
    <div>
      <TypographyH1 className="p-4">PlayWithFriends</TypographyH1>
      <section className="mx-auto my-8 max-w-xl rounded-xl border bg-card text-card-foreground shadow">
        <div className="flex flex-col space-y-1.5 p-6">
          <TypographyH4>Online Twenty 9 Multiplayer</TypographyH4>
          <TypographyMuted>Enter room code or create one.</TypographyMuted>
        </div>
        {cardType === "joinRoom" && (
          <div className="p-6 pt-0">
            <Form {...joinRoomForm}>
              <form
                onSubmit={joinRoomForm.handleSubmit(handleJoinRoom)}
                className="space-y-6"
              >
                <FormField
                  control={joinRoomForm.control}
                  name="roomCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Room Code</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter room code" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex items-center justify-between">
                  <Button
                    variant="outline"
                    onClick={() => setCardType("createRoom")}
                  >
                    Create New Room
                  </Button>
                  <Button type="submit">Join</Button>
                </div>
              </form>
            </Form>
          </div>
        )}
        {cardType === "createRoom" && (
          <div className="p-6 pt-0">
            <Form {...createRoomForm}>
              <form
                onSubmit={createRoomForm.handleSubmit(handleCreateRoom)}
                className="space-y-6"
              >
                <FormField
                  control={createRoomForm.control}
                  name="seventhCard"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center space-x-2">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel>Allow seventh card</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
                <FormField
                  control={createRoomForm.control}
                  name="doubleRedouble"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center space-x-2">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel>Allow double-redouble</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
                <div className="flex items-center justify-between">
                  <Button
                    variant="outline"
                    onClick={() => setCardType("joinRoom")}
                  >
                    Join Existing Room
                  </Button>
                  <Button type="submit">Create</Button>
                </div>
              </form>
            </Form>
          </div>
        )}
      </section>
    </div>
  );
}

export default Twenty9PlayWithFriendsPage;
