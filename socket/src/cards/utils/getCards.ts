import { chunk, shuffle } from "lodash";
import cards from "..";
import { IPlayerCard } from "../../@types/card";

export function getGameCards(): IPlayerCard[] {
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
