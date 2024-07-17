import { Metadata } from "next";
import { ReactNode } from "react";
import { Twenty9RoomProvider } from "./Twenty9RoomProvider";

export const metadata: Metadata = {
  title: "Twenty 9",
  description: "Twenty 9 a card playing game by Ace Arena.",
};

function Twenty9RoomLayout({ children }: { children: Readonly<ReactNode> }) {
  return <Twenty9RoomProvider>{children}</Twenty9RoomProvider>;
}

export default Twenty9RoomLayout;
