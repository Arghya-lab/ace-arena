"use client";

import { cn } from "@/lib/utils";
import { useSocket } from "./providers/SocketProvider";

export default function SocketConnectSignal() {
  const { isConnected } = useSocket();

  return (
    <div
      className={cn(
        "h-2 w-2 rounded-full",
        isConnected ? "bg-green-600" : "bg-red-600"
      )}
    />
  );
}
