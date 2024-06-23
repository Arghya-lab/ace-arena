export enum SuitsEnum {
  Clubs = "Clubs", // ♣️
  Spades = "Spades", // ♠️
  Hearts = "Hearts", // ♥️
  Diamonds = "Diamonds", // ♦️
}

export enum CardRankEnum {
  Ace = "Ace",
  Two = "2",
  Three = "3",
  Four = "4",
  Five = "5",
  Six = "6",
  Seven = "7",
  Eight = "8",
  Nine = "9",
  Ten = "10",
  Jack = "Jack",
  Queen = "Queen",
  King = "King",
}

export interface ICard {
  id: number;
  name: string;
  suit: SuitsEnum;
  rank: CardRankEnum;
  url: string;
  isValid29GameCard: boolean;
  "29GameCardRank": -1 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8; // J=>1, 9=>2, A=>3, 10=>4, K=>5, Q=>6, 8=>7, 7=>8
  "29GameCardPoint": 0 | 1 | 2 | 3;
}

export interface IPlayerCards {
  playerId: 1 | 2 | 3 | 4;
  cards: ICard[];
}
