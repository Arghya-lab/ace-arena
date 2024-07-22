"use client";

import useSocket from "@/hooks/useSocket";
import { cn } from "@/utils/cn";

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
