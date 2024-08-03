"use client";

import { IPlayer } from "@/@types/game";
import usePageSize from "@/hooks/usePageSize";
import {cn} from "@/utils/cn";
import { motion } from "framer-motion";
import Card from "./Card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

function OppHandCards({
  totalCards,
  player,
  position,
}: {
  totalCards: number;
  player?: IPlayer;
  position: "front" | "left" | "right";
}) {
  const { pageWidth, pageHeight } = usePageSize();

  function generateRandomAngle() {
    return Math.random() * 360;
  }

  return (
    <div
      className={cn("absolute flex", {
        "items-centre -right-8 -top-40 h-full w-40 items-center":
          position === "right",
        "items-centre -left-44 -top-40 h-full w-40 items-center":
          position === "left",
        "-left-20 -top-40 h-40 w-full justify-center": position === "front",
      })}
    >
      {Array.from({ length: totalCards }).map((i, id) => (
        <motion.div
          key={id}
          className="absolute select-none"
          initial={{ rotate: 0, zIndex: 20 }}
          animate={{
            rotate:
              position === "right" ? -90 : position === "front" ? 180 : 90,
            zIndex: 20 + id * 5,
            y: position === "right" || position === "left" ? id * 16 : 0,
            x:
              (pageWidth < 1200 ? 48 : 24) +
              id * (position === "right" || position === "left" ? 0 : 16),
            transition: { duration: 0.5 },
            scale: 0.72,
          }}
          exit={{
            x: 0,
            y: (pageHeight - 80) / 2,
            rotate: generateRandomAngle(),
          }}
        >
          <Card />
        </motion.div>
      ))}
      {player && (
        <motion.div
          className="absolute"
          animate={{
            zIndex: 90,
            y: position === "front" ? 192 : totalCards * 12,
            x:
              position === "right"
                ? 40
                : position === "front"
                  ? totalCards * 24
                  : 200,
          }}
        >
          <Avatar className="h-16 w-16">
            <AvatarImage src={player.imageUrl} alt={player.name} />
            <AvatarFallback>
              {player.name
                .split(" ")
                .map((p) => p.slice(0, 1).toUpperCase())
                .join("")}
            </AvatarFallback>
          </Avatar>
        </motion.div>
      )}
    </div>
  );
}

export default OppHandCards;
