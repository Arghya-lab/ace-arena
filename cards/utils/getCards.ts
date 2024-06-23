// "server only";

import { IPlayerCards } from "@/@types/card";
import { chunk, shuffle } from "lodash";
import cards from "..";

export function getGameCards(): IPlayerCards[] {
  const shuffleCards = shuffle(cards);
  const cardChunk = chunk(shuffleCards, 13);

  return [
    {
      playerId: 1,
      cards: cardChunk[0],
    },
    {
      playerId: 2,
      cards: cardChunk[1],
    },
    {
      playerId: 3,
      cards: cardChunk[2],
    },
    {
      playerId: 4,
      cards: cardChunk[3],
    },
  ];
}
