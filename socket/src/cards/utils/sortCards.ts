import { ICard } from "../../@types/card";

export default function sortCards(cards: ICard[]): ICard[] {
  return cards.sort((a, b) => a.id - b.id);
}
