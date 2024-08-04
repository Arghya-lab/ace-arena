import { chunk, shuffle } from "lodash";
import cards from "..";
import { IPlayerCard } from "../../@types/card";

export function getGameCards(): IPlayerCard[] {
  const shuffleCards = shuffle(cards.map((card) => card.id));
  const cardChunk = chunk(shuffleCards, 13);

  return [
    {
      playerId: 1,
      cardIds: cardChunk[0],
    },
    {
      playerId: 2,
      cardIds: cardChunk[1],
    },
    {
      playerId: 3,
      cardIds: cardChunk[2],
    },
    {
      playerId: 4,
      cardIds: cardChunk[3],
    },
  ];
}
