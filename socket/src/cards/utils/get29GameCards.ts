import { chunk, difference, differenceBy, random, shuffle } from "lodash";
import { default as cardItems, default as cards } from "..";
import { CardIdType, ICard, IPlayerCard, SuitsEnum } from "../..//@types/card";
import weightedRandomPicker from "../../utils/weightedRandomPicker";

export function get29Game1stPhaseCards(): IPlayerCard[] {
  let left29GameCards: ICard[] = shuffle(
    cards.filter((card) => card.isValid29GameCard)
  );

  let leftLuckySuits = Object.values(SuitsEnum);

  /*
  1st Team = 1st, 3rd player
  2nd Team = 2nd, 4th player
  */

  const is1stTeamLucky = weightedRandomPicker([2 / 3, 1 / 3]) === 1;
  const is2ndTeamLucky = weightedRandomPicker([2 / 3, 1 / 3]) === 1;

  const is1stPlayerLucky = is1stTeamLucky ? !!random(1) : false;
  const is3rdPlayerLucky = is1stTeamLucky
    ? is1stPlayerLucky
      ? false
      : true
    : false;
  const is2ndPlayerLucky = is2ndTeamLucky ? !!random(1) : false;
  const is4thPlayerLucky = is2ndTeamLucky
    ? is2ndPlayerLucky
      ? false
      : true
    : false;

  function createUnluckyPlayerDeck(): CardIdType[] {
    const playerCards = chunk(left29GameCards, 4)[0];
    left29GameCards = differenceBy(left29GameCards, playerCards, "id");

    return shuffle(playerCards).map((card) => card.id);
  }

  function createLuckyPlayerDeck(): CardIdType[] {
    const sameSuitCardCount = weightedRandomPicker([0, 0, 60, 40]);
    const luckySuit = leftLuckySuits[random(0, leftLuckySuits.length - 1)];

    const luckySuitCards = shuffle(
      left29GameCards.filter((card) => card.suit === luckySuit)
    ).slice(0, sameSuitCardCount);
    const extraCards = left29GameCards
      .filter((card) => card.suit != luckySuit)
      .slice(0, 4 - sameSuitCardCount);

    const playerCards = [...luckySuitCards, ...extraCards];

    leftLuckySuits = difference(leftLuckySuits, [luckySuit]);
    left29GameCards = differenceBy(left29GameCards, playerCards, "id");

    return shuffle(playerCards).map((card) => card.id);
  }

  return [
    {
      playerId: 1,
      cardIds: is1stPlayerLucky
        ? createLuckyPlayerDeck()
        : createUnluckyPlayerDeck(),
    },
    {
      playerId: 2,
      cardIds: is2ndPlayerLucky
        ? createLuckyPlayerDeck()
        : createUnluckyPlayerDeck(),
    },
    {
      playerId: 3,
      cardIds: is3rdPlayerLucky
        ? createLuckyPlayerDeck()
        : createUnluckyPlayerDeck(),
    },
    {
      playerId: 4,
      cardIds: is4thPlayerLucky
        ? createLuckyPlayerDeck()
        : createUnluckyPlayerDeck(),
    },
  ];
}

export function get29GameCards(_1stHand: IPlayerCard[]): IPlayerCard[] {
  let left29GameCards: ICard[] = shuffle(
    differenceBy(
      cards.filter((card) => card.isValid29GameCard),
      _1stHand
        .reduce((acc: CardIdType[], data) => [...acc, ...data.cardIds], [])
        .map((cardId) => cardItems.find((card) => card.id === cardId) as ICard),
      "id"
    )
  );

  const sortedLuckyPlayers = _1stHand
    .map((data) => {
      const _1stHandRank =
        data.cardIds
          .map(
            (cardId) => cardItems.find((card) => card.id === cardId) as ICard
          )
          .reduce((acc, card) => acc + card["29GameCardRank"], 0) *
        data.cardIds
          .map(
            (cardId) => cardItems.find((card) => card.id === cardId) as ICard
          )
          .reduce(
            (acc: SuitsEnum[], data) =>
              acc.includes(data.suit) ? acc : [...acc, data.suit],
            []
          ).length; // rank will be 7 to 128 i.e. same suit J, 9, A, 10 =>7 point & all different suit 7, ,, 7, 7 =>128 point

      let luckyPoint: number;

      if (_1stHandRank <= 27) {
        luckyPoint = random(5, 20);
      } else if (_1stHandRank <= 47) {
        luckyPoint = random(15, 30);
      } else if (_1stHandRank <= 67) {
        luckyPoint = random(25, 40);
      } else if (_1stHandRank <= 87) {
        luckyPoint = random(35, 50);
      } else if (_1stHandRank <= 107) {
        luckyPoint = random(45, 60);
      } else {
        luckyPoint = random(55, 70);
      }

      return {
        playerId: data.playerId,
        luckyPoint,
      };
    })
    .sort((a, b) => b.luckyPoint - a.luckyPoint)
    .slice(0, weightedRandomPicker([67, 33]));

  let suitCounts: { [key in SuitsEnum]: number } = {
    [SuitsEnum.Clubs]: 0,
    [SuitsEnum.Spades]: 0,
    [SuitsEnum.Hearts]: 0,
    [SuitsEnum.Diamonds]: 0,
  };
  left29GameCards.forEach((card) => {
    suitCounts[card.suit]++;
  });

  const sortedSuitCounts = Object.entries(suitCounts)
    .sort((a, b) => b[1] - a[1])
    .map((entry) => entry as [SuitsEnum, number]);

  function createUnluckyPlayerDeck(): CardIdType[] {
    const playerCards = chunk(left29GameCards, 4)[0];
    left29GameCards = differenceBy(left29GameCards, playerCards, "id");

    return shuffle(playerCards.map((card) => card.id));
  }

  function createLuckyPlayerDeck(): CardIdType[] {
    const luckySuit =
      sortedSuitCounts[
        weightedRandomPicker(sortedSuitCounts.map((i) => i[1]))
      ][0];
    const sameSuitCardCount = weightedRandomPicker([0, 20, 60, 20]);

    const luckySuitCards = left29GameCards
      .filter((card) => card.suit === luckySuit)
      .slice(0, sameSuitCardCount);
    left29GameCards = differenceBy(left29GameCards, luckySuitCards, "id");

    const extraCards = left29GameCards.slice(0, 4 - luckySuitCards.length);
    left29GameCards = differenceBy(left29GameCards, extraCards, "id");

    return shuffle([...extraCards, ...luckySuitCards].map((card) => card.id));
  }

  let _1stPlayerCardIds: CardIdType[] | null = null;
  let _2ndPlayerCardIds: CardIdType[] | null = null;
  let _3rdPlayerCardIds: CardIdType[] | null = null;
  let _4thPlayerCardIds: CardIdType[] | null = null;

  sortedLuckyPlayers.forEach((luckyPlayer) => {
    if (luckyPlayer.playerId === 1) _1stPlayerCardIds = createLuckyPlayerDeck();
    if (luckyPlayer.playerId === 2) _2ndPlayerCardIds = createLuckyPlayerDeck();
    if (luckyPlayer.playerId === 3) _3rdPlayerCardIds = createLuckyPlayerDeck();
    if (luckyPlayer.playerId === 4) _4thPlayerCardIds = createLuckyPlayerDeck();
  });

  return [
    {
      playerId: 1,
      cardIds: [
        ...(_1stHand.find((deck) => deck.playerId === 1) as IPlayerCard)
          .cardIds,
        ...(_1stPlayerCardIds || createUnluckyPlayerDeck()),
      ],
    },
    {
      playerId: 2,
      cardIds: [
        ...(_1stHand.find((deck) => deck.playerId === 2) as IPlayerCard)
          .cardIds,
        ...(_2ndPlayerCardIds || createUnluckyPlayerDeck()),
      ],
    },
    {
      playerId: 3,
      cardIds: [
        ...(_1stHand.find((deck) => deck.playerId === 3) as IPlayerCard)
          .cardIds,
        ...(_3rdPlayerCardIds || createUnluckyPlayerDeck()),
      ],
    },
    {
      playerId: 4,
      cardIds: [
        ...(_1stHand.find((deck) => deck.playerId === 4) as IPlayerCard)
          .cardIds,
        ...(_4thPlayerCardIds || createUnluckyPlayerDeck()),
      ],
    },
  ];
}
