import { ICard, SuitsEnum } from "@/@types/card";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useState } from "react";
import { TypographyP } from "./typography";

function Card({ card }: { card?: ICard }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);

  const [isCornerLoaded, setIsCornerLoaded] = useState(false);
  const [isCornerError, setIsCornerError] = useState(false);

  return (
    <div
      className={cn(
        "relative aspect-[13/20] w-36 rounded-xl md:w-48",
        !card && "m-8 flex items-center justify-center border border-[#d19f4e]"
      )}
      style={{
        backgroundImage: !card
          ? "radial-gradient(circle, #FFFAEF, #F0D19E)"
          : "none",
      }}
    >
      {(!isLoaded || isError) && (
        <div
          className={cn(
            "absolute left-0 top-0 h-full w-full overflow-hidden rounded-xl p-2 font-semibold md:w-48",
            card?.suit === SuitsEnum.Clubs && "text-black",
            card?.suit === SuitsEnum.Spades && "text-black",
            card?.suit === SuitsEnum.Diamonds && "text-red-600",
            card?.suit === SuitsEnum.Hearts && "text-red-600",
            !card && "flex items-center justify-center text-[#926d32]",
            card && "border-2 bg-slate-50"
          )}
        >
          <TypographyP
            className={cn(
              "font-raleway w-10 break-words text-3xl tracking-widest",
              !card && "w-auto text-6xl opacity-50"
            )}
          >
            {card?.textImg || "💀"}
          </TypographyP>
        </div>
      )}
      <Image
        src={`/cards/${card?.url || "BG.png"}`}
        alt={card?.textImg || "A-A"}
        width={256}
        height={(256 * 20) / 13}
        className={cn(
          "w-36 md:w-48",
          card && "absolute left-0 top-0 aspect-[13/20]"
        )}
        draggable="false"
        onLoad={() => setIsLoaded(true)}
        onError={() => setIsError(true)}
        style={{ opacity: isLoaded || !isError ? 1 : 0 }}
      />
      {!card && (
        <>
          <Image
            src="/cards/BG-corner.png"
            alt=""
            width={64}
            height={(64 * 20) / 13}
            className="absolute left-0.5 top-0.5 w-12 -rotate-90 md:w-16"
            draggable="false"
            onLoad={() => setIsCornerLoaded(true)}
            onError={() => setIsCornerError(true)}
            style={{ opacity: isCornerLoaded || !isCornerError ? 1 : 0 }}
          />
          <Image
            src="/cards/BG-corner.png"
            alt=""
            width={64}
            height={(64 * 20) / 13}
            className="absolute right-0.5 top-0.5 w-12 md:w-16"
            draggable="false"
            onLoad={() => setIsCornerLoaded(true)}
            onError={() => setIsCornerError(true)}
            style={{ opacity: isCornerLoaded || !isCornerError ? 1 : 0 }}
          />
          <Image
            src="/cards/BG-corner.png"
            alt=""
            width={64}
            height={(64 * 20) / 13}
            className="absolute bottom-0.5 right-0.5 w-12 rotate-90 md:w-16"
            draggable="false"
            onLoad={() => setIsCornerLoaded(true)}
            onError={() => setIsCornerError(true)}
            style={{ opacity: isCornerLoaded || !isCornerError ? 1 : 0 }}
          />
          <Image
            src="/cards/BG-corner.png"
            alt=""
            width={64}
            height={(64 * 20) / 13}
            className="absolute bottom-0.5 left-0.5 w-12 rotate-180 md:w-16"
            draggable="false"
            onLoad={() => setIsCornerLoaded(true)}
            onError={() => setIsCornerError(true)}
            style={{ opacity: isCornerLoaded || !isCornerError ? 1 : 0 }}
          />
        </>
      )}
    </div>
  );
}

export default Card;
