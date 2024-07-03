import { CardRankEnum, ICard, SuitsEnum } from "@/@types/card";

export const clubsCards: Readonly<ICard[]> = [
  {
    id: 1,
    name: "Ace of Clubs",
    suit: SuitsEnum.Clubs,
    rank: CardRankEnum.Ace,
    url: "AC.png",
    textImg: "A ♣️",
    isValid29GameCard: true,
    "29GameCardRank": 3,
    "29GameCardPoint": 1,
  },
  {
    id: 2,
    name: "2 of Clubs",
    suit: SuitsEnum.Clubs,
    rank: CardRankEnum.Two,
    url: "2C.png",
    textImg: "2 ♣️",
    isValid29GameCard: false,
    "29GameCardRank": -1,
    "29GameCardPoint": 0,
  },
  {
    id: 3,
    name: "3 of Clubs",
    suit: SuitsEnum.Clubs,
    rank: CardRankEnum.Three,
    url: "3C.png",
    textImg: "3 ♣️",
    isValid29GameCard: false,
    "29GameCardRank": -1,
    "29GameCardPoint": 0,
  },
  {
    id: 4,
    name: "4 of Clubs",
    suit: SuitsEnum.Clubs,
    rank: CardRankEnum.Four,
    url: "4C.png",
    textImg: "4 ♣️",
    isValid29GameCard: false,
    "29GameCardRank": -1,
    "29GameCardPoint": 0,
  },
  {
    id: 5,
    name: "5 of Clubs",
    suit: SuitsEnum.Clubs,
    rank: CardRankEnum.Five,
    url: "5C.png",
    textImg: "5 ♣️",
    isValid29GameCard: false,
    "29GameCardRank": -1,
    "29GameCardPoint": 0,
  },
  {
    id: 6,
    name: "6 of Clubs",
    suit: SuitsEnum.Clubs,
    rank: CardRankEnum.Six,
    url: "6C.png",
    textImg: "6 ♣️",
    isValid29GameCard: false,
    "29GameCardRank": -1,
    "29GameCardPoint": 0,
  },
  {
    id: 7,
    name: "7 of Clubs",
    suit: SuitsEnum.Clubs,
    rank: CardRankEnum.Seven,
    url: "7C.png",
    textImg: "7 ♣️",
    isValid29GameCard: true,
    "29GameCardRank": 8,
    "29GameCardPoint": 0,
  },
  {
    id: 8,
    name: "8 of Clubs",
    suit: SuitsEnum.Clubs,
    rank: CardRankEnum.Eight,
    url: "8C.png",
    textImg: "8 ♣️",
    isValid29GameCard: true,
    "29GameCardRank": 7,
    "29GameCardPoint": 0,
  },
  {
    id: 9,
    name: "9 of Clubs",
    suit: SuitsEnum.Clubs,
    rank: CardRankEnum.Nine,
    url: "9C.png",
    textImg: "9 ♣️",
    isValid29GameCard: true,
    "29GameCardRank": 2,
    "29GameCardPoint": 2,
  },
  {
    id: 10,
    name: "10 of Clubs",
    suit: SuitsEnum.Clubs,
    rank: CardRankEnum.Ten,
    url: "10C.png",
    textImg: "10 ♣️",
    isValid29GameCard: true,
    "29GameCardRank": 4,
    "29GameCardPoint": 1,
  },
  {
    id: 11,
    name: "Jack of Clubs",
    suit: SuitsEnum.Clubs,
    rank: CardRankEnum.Jack,
    url: "JC.png",
    textImg: "J ♣️",
    isValid29GameCard: true,
    "29GameCardRank": 1,
    "29GameCardPoint": 3,
  },
  {
    id: 12,
    name: "Queen of Clubs",
    suit: SuitsEnum.Clubs,
    rank: CardRankEnum.Queen,
    url: "QC.png",
    textImg: "Q ♣️",
    isValid29GameCard: true,
    "29GameCardRank": 6,
    "29GameCardPoint": 0,
  },
  {
    id: 13,
    name: "King of Clubs",
    suit: SuitsEnum.Clubs,
    rank: CardRankEnum.King,
    url: "KC.png",
    textImg: "K ♣️",
    isValid29GameCard: true,
    "29GameCardRank": 5,
    "29GameCardPoint": 0,
  },
];

export const diamondsCards: Readonly<ICard[]> = [
  {
    id: 14,
    name: "Ace of Diamonds",
    suit: SuitsEnum.Diamonds,
    rank: CardRankEnum.Ace,
    url: "AD.png",
    textImg: "A ♦️",
    isValid29GameCard: true,
    "29GameCardRank": 3,
    "29GameCardPoint": 1,
  },
  {
    id: 15,
    name: "2 of Diamonds",
    suit: SuitsEnum.Diamonds,
    rank: CardRankEnum.Two,
    url: "2D.png",
    textImg: "2 ♦️",
    isValid29GameCard: false,
    "29GameCardRank": -1,
    "29GameCardPoint": 0,
  },
  {
    id: 16,
    name: "3 of Diamonds",
    suit: SuitsEnum.Diamonds,
    rank: CardRankEnum.Three,
    url: "3D.png",
    textImg: "3 ♦️",
    isValid29GameCard: false,
    "29GameCardRank": -1,
    "29GameCardPoint": 0,
  },
  {
    id: 17,
    name: "4 of Diamonds",
    suit: SuitsEnum.Diamonds,
    rank: CardRankEnum.Four,
    url: "4D.png",
    textImg: "4 ♦️",
    isValid29GameCard: false,
    "29GameCardRank": -1,
    "29GameCardPoint": 0,
  },
  {
    id: 18,
    name: "5 of Diamonds",
    suit: SuitsEnum.Diamonds,
    rank: CardRankEnum.Five,
    url: "5D.png",
    textImg: "5 ♦️",
    isValid29GameCard: false,
    "29GameCardRank": -1,
    "29GameCardPoint": 0,
  },
  {
    id: 19,
    name: "6 of Diamonds",
    suit: SuitsEnum.Diamonds,
    rank: CardRankEnum.Six,
    url: "6D.png",
    textImg: "6 ♦️",
    isValid29GameCard: false,
    "29GameCardRank": -1,
    "29GameCardPoint": 0,
  },
  {
    id: 20,
    name: "7 of Diamonds",
    suit: SuitsEnum.Diamonds,
    rank: CardRankEnum.Seven,
    url: "7D.png",
    textImg: "7 ♦️",
    isValid29GameCard: true,
    "29GameCardRank": 8,
    "29GameCardPoint": 0,
  },
  {
    id: 21,
    name: "8 of Diamonds",
    suit: SuitsEnum.Diamonds,
    rank: CardRankEnum.Eight,
    url: "8D.png",
    textImg: "8 ♦️",
    isValid29GameCard: true,
    "29GameCardRank": 7,
    "29GameCardPoint": 0,
  },
  {
    id: 22,
    name: "9 of Diamonds",
    suit: SuitsEnum.Diamonds,
    rank: CardRankEnum.Nine,
    url: "9D.png",
    textImg: "9 ♦️",
    isValid29GameCard: true,
    "29GameCardRank": 2,
    "29GameCardPoint": 2,
  },
  {
    id: 23,
    name: "10 of Diamonds",
    suit: SuitsEnum.Diamonds,
    rank: CardRankEnum.Ten,
    url: "10D.png",
    textImg: "10 ♦️",
    isValid29GameCard: true,
    "29GameCardRank": 4,
    "29GameCardPoint": 1,
  },
  {
    id: 24,
    name: "Jack of Diamonds",
    suit: SuitsEnum.Diamonds,
    rank: CardRankEnum.Jack,
    url: "JD.png",
    textImg: "J ♦️",
    isValid29GameCard: true,
    "29GameCardRank": 1,
    "29GameCardPoint": 3,
  },
  {
    id: 25,
    name: "Queen of Diamonds",
    suit: SuitsEnum.Diamonds,
    rank: CardRankEnum.Queen,
    url: "QD.png",
    textImg: "Q ♦️",
    isValid29GameCard: true,
    "29GameCardRank": 6,
    "29GameCardPoint": 0,
  },
  {
    id: 26,
    name: "King of Diamonds",
    suit: SuitsEnum.Diamonds,
    rank: CardRankEnum.King,
    url: "KD.png",
    textImg: "K ♦️",
    isValid29GameCard: true,
    "29GameCardRank": 5,
    "29GameCardPoint": 0,
  },
];

export const spadesCards: Readonly<ICard[]> = [
  {
    id: 27,
    name: "Ace of Spades",
    suit: SuitsEnum.Spades,
    rank: CardRankEnum.Ace,
    url: "AS.png",
    textImg: "A ♠️",
    isValid29GameCard: true,
    "29GameCardRank": 3,
    "29GameCardPoint": 1,
  },
  {
    id: 28,
    name: "2 of Spades",
    suit: SuitsEnum.Spades,
    rank: CardRankEnum.Two,
    url: "2S.png",
    textImg: "2 ♠️",
    isValid29GameCard: false,
    "29GameCardRank": -1,
    "29GameCardPoint": 0,
  },
  {
    id: 29,
    name: "3 of Spades",
    suit: SuitsEnum.Spades,
    rank: CardRankEnum.Three,
    url: "3S.png",
    textImg: "3 ♠️",
    isValid29GameCard: false,
    "29GameCardRank": -1,
    "29GameCardPoint": 0,
  },
  {
    id: 30,
    name: "4 of Spades",
    suit: SuitsEnum.Spades,
    rank: CardRankEnum.Four,
    url: "4S.png",
    textImg: "4 ♠️",
    isValid29GameCard: false,
    "29GameCardRank": -1,
    "29GameCardPoint": 0,
  },
  {
    id: 31,
    name: "5 of Spades",
    suit: SuitsEnum.Spades,
    rank: CardRankEnum.Five,
    url: "5S.png",
    textImg: "5 ♠️",
    isValid29GameCard: false,
    "29GameCardRank": -1,
    "29GameCardPoint": 0,
  },
  {
    id: 32,
    name: "6 of Spades",
    suit: SuitsEnum.Spades,
    rank: CardRankEnum.Six,
    url: "6S.png",
    textImg: "6 ♠️",
    isValid29GameCard: false,
    "29GameCardRank": -1,
    "29GameCardPoint": 0,
  },
  {
    id: 33,
    name: "7 of Spades",
    suit: SuitsEnum.Spades,
    rank: CardRankEnum.Seven,
    url: "7S.png",
    textImg: "7 ♠️",
    isValid29GameCard: true,
    "29GameCardRank": 8,
    "29GameCardPoint": 0,
  },
  {
    id: 34,
    name: "8 of Spades",
    suit: SuitsEnum.Spades,
    rank: CardRankEnum.Eight,
    url: "8S.png",
    textImg: "8 ♠️",
    isValid29GameCard: true,
    "29GameCardRank": 7,
    "29GameCardPoint": 0,
  },
  {
    id: 35,
    name: "9 of Spades",
    suit: SuitsEnum.Spades,
    rank: CardRankEnum.Nine,
    url: "9S.png",
    textImg: "9 ♠️",
    isValid29GameCard: true,
    "29GameCardRank": 2,
    "29GameCardPoint": 2,
  },
  {
    id: 36,
    name: "10 of Spades",
    suit: SuitsEnum.Spades,
    rank: CardRankEnum.Ten,
    url: "10S.png",
    textImg: "10 ♠️",
    isValid29GameCard: true,
    "29GameCardRank": 4,
    "29GameCardPoint": 1,
  },
  {
    id: 37,
    name: "Jack of Spades",
    suit: SuitsEnum.Spades,
    rank: CardRankEnum.Jack,
    url: "JS.png",
    textImg: "J ♠️",
    isValid29GameCard: true,
    "29GameCardRank": 1,
    "29GameCardPoint": 3,
  },
  {
    id: 38,
    name: "Queen of Spades",
    suit: SuitsEnum.Spades,
    rank: CardRankEnum.Queen,
    url: "QS.png",
    textImg: "Q ♠️",
    isValid29GameCard: true,
    "29GameCardRank": 6,
    "29GameCardPoint": 0,
  },
  {
    id: 39,
    name: "King of Spades",
    suit: SuitsEnum.Spades,
    rank: CardRankEnum.King,
    url: "KS.png",
    textImg: "K ♠️",
    isValid29GameCard: true,
    "29GameCardRank": 5,
    "29GameCardPoint": 0,
  },
];

export const heartsCards: Readonly<ICard[]> = [
  {
    id: 40,
    name: "Ace of Hearts",
    suit: SuitsEnum.Hearts,
    rank: CardRankEnum.Ace,
    url: "AH.png",
    textImg: "A ♥️",
    isValid29GameCard: true,
    "29GameCardRank": 3,
    "29GameCardPoint": 1,
  },
  {
    id: 41,
    name: "2 of Hearts",
    suit: SuitsEnum.Hearts,
    rank: CardRankEnum.Two,
    url: "2H.png",
    textImg: "2 ♥️",
    isValid29GameCard: false,
    "29GameCardRank": -1,
    "29GameCardPoint": 0,
  },
  {
    id: 42,
    name: "3 of Hearts",
    suit: SuitsEnum.Hearts,
    rank: CardRankEnum.Three,
    url: "3H.png",
    textImg: "3 ♥️",
    isValid29GameCard: false,
    "29GameCardRank": -1,
    "29GameCardPoint": 0,
  },
  {
    id: 43,
    name: "4 of Hearts",
    suit: SuitsEnum.Hearts,
    rank: CardRankEnum.Four,
    url: "4H.png",
    textImg: "4 ♥️",
    isValid29GameCard: false,
    "29GameCardRank": -1,
    "29GameCardPoint": 0,
  },
  {
    id: 44,
    name: "5 of Hearts",
    suit: SuitsEnum.Hearts,
    rank: CardRankEnum.Five,
    url: "5H.png",
    textImg: "5 ♥️",
    isValid29GameCard: false,
    "29GameCardRank": -1,
    "29GameCardPoint": 0,
  },
  {
    id: 45,
    name: "6 of Hearts",
    suit: SuitsEnum.Hearts,
    rank: CardRankEnum.Six,
    url: "6H.png",
    textImg: "6 ♥️",
    isValid29GameCard: false,
    "29GameCardRank": -1,
    "29GameCardPoint": 0,
  },
  {
    id: 46,
    name: "7 of Hearts",
    suit: SuitsEnum.Hearts,
    rank: CardRankEnum.Seven,
    url: "7H.png",
    textImg: "7 ♥️",
    isValid29GameCard: true,
    "29GameCardRank": 8,
    "29GameCardPoint": 0,
  },
  {
    id: 47,
    name: "8 of Hearts",
    suit: SuitsEnum.Hearts,
    rank: CardRankEnum.Eight,
    url: "8H.png",
    textImg: "8 ♥️",
    isValid29GameCard: true,
    "29GameCardRank": 7,
    "29GameCardPoint": 0,
  },
  {
    id: 48,
    name: "9 of Hearts",
    suit: SuitsEnum.Hearts,
    rank: CardRankEnum.Nine,
    url: "9H.png",
    textImg: "9 ♥️",
    isValid29GameCard: true,
    "29GameCardRank": 2,
    "29GameCardPoint": 2,
  },
  {
    id: 49,
    name: "10 of Hearts",
    suit: SuitsEnum.Hearts,
    rank: CardRankEnum.Ten,
    url: "10H.png",
    textImg: "10 ♥️",
    isValid29GameCard: true,
    "29GameCardRank": 4,
    "29GameCardPoint": 1,
  },
  {
    id: 50,
    name: "Jack of Hearts",
    suit: SuitsEnum.Hearts,
    rank: CardRankEnum.Jack,
    url: "JH.png",
    textImg: "J ♥️",
    isValid29GameCard: true,
    "29GameCardRank": 1,
    "29GameCardPoint": 3,
  },
  {
    id: 51,
    name: "Queen of Hearts",
    suit: SuitsEnum.Hearts,
    rank: CardRankEnum.Queen,
    url: "QH.png",
    textImg: "Q ♥️",
    isValid29GameCard: true,
    "29GameCardRank": 6,
    "29GameCardPoint": 0,
  },
  {
    id: 52,
    name: "King of Hearts",
    suit: SuitsEnum.Hearts,
    rank: CardRankEnum.King,
    url: "KH.png",
    textImg: "K ♥️",
    isValid29GameCard: true,
    "29GameCardRank": 5,
    "29GameCardPoint": 0,
  },
];

const cardItems: Readonly<ICard[]> = [
  ...clubsCards,
  ...diamondsCards,
  ...spadesCards,
  ...heartsCards,
];

export default cardItems;

export * from "./utils/get29GameCards";
export * from "./utils/getCards";
export * from "./utils/sortCards";