export type CardIdType =
  | 1
  | 2
  | 3
  | 4
  | 5
  | 6
  | 7
  | 8
  | 9
  | 10
  | 11
  | 12
  | 13
  | 14
  | 15
  | 16
  | 17
  | 18
  | 19
  | 20
  | 21
  | 22
  | 23
  | 24
  | 25
  | 26
  | 27
  | 28
  | 29
  | 30
  | 31
  | 32
  | 33
  | 34
  | 35
  | 36
  | 37
  | 38
  | 39
  | 40
  | 41
  | 42
  | 43
  | 44
  | 45
  | 46
  | 47
  | 48
  | 49
  | 50
  | 51
  | 52;

export enum SuitsEnum {
  Clubs = "Clubs", // ♣️
  Diamonds = "Diamonds", // ♦️
  Spades = "Spades", // ♠️
  Hearts = "Hearts", // ♥️
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
  id: CardIdType;
  name: string;
  suit: SuitsEnum;
  rank: CardRankEnum;
  url: string;
  textImg: string;
  isValid29GameCard: boolean;
  "29GameCardRank": 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | -1; // J=>1, 9=>2, A=>3, 10=>4, K=>5, Q=>6, 8=>7, 7=>8
  "29GameCardPoint": 0 | 1 | 2 | 3;
}

export interface IPlayerCard {
  playerId: 1 | 2 | 3 | 4;
  cardIds: CardIdType[];
}

export type ICardCounts = [
  { playerId: 1; count: number },
  { playerId: 2; count: number },
  { playerId: 3; count: number },
  { playerId: 4; count: number },
];

export enum SeventhCardEnum {
  SEVENTH = "Seventh",
}

export type TrumpOptionsEnum = SuitsEnum | SeventhCardEnum;
