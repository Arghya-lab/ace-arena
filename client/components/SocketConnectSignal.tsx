"use client";

import { socket } from "@/app/socket";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

export default function SocketConnectSignal() {
  const [isConnected, setIsConnected] = useState(false);

  function onConnect() {
    console.log("connected to socket");

    setIsConnected(true);
  }

  function onDisconnect() {
    setIsConnected(false);
  }

  useEffect(() => {
    if (socket.connected) onConnect();

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
    };
  }, []);

  return (
    <div
      className={cn(
        "h-2 w-2 rounded-full",
        isConnected ? "bg-green-600" : "bg-red-600"
      )}
    />
  );
}
