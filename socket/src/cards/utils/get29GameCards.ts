import { chunk, difference, differenceBy, random, shuffle } from "lodash";
import cards from "..";
import { ICard, IPlayerCards, SuitsEnum } from "../..//@types/card";
import weightedRandomPicker from "../../utils/weightedRandomPicker";

export function get29Game1stPhaseCards(): IPlayerCards[] {
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

  let _1stPlayerCards: ICard[] | null = null;
  let _2ndPlayerCards: ICard[] | null = null;
  let _3rdPlayerCards: ICard[] | null = null;
  let _4thPlayerCards: ICard[] | null = null;

  function createUnluckyPlayerDeck(): ICard[] {
    const playerCards = chunk(left29GameCards, 4)[0];
    left29GameCards = differenceBy(left29GameCards, playerCards, "id");

    return shuffle(playerCards);
  }

  function createLuckyPlayerDeck(): ICard[] {
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

    return shuffle(playerCards);
  }

  if (is1stPlayerLucky) _1stPlayerCards = createLuckyPlayerDeck();
  if (is2ndPlayerLucky) _2ndPlayerCards = createLuckyPlayerDeck();
  if (is3rdPlayerLucky) _3rdPlayerCards = createLuckyPlayerDeck();
  if (is4thPlayerLucky) _4thPlayerCards = createLuckyPlayerDeck();

  return [
    {
      playerId: 1,
      cards: _1stPlayerCards || createUnluckyPlayerDeck(),
    },
    {
      playerId: 2,
      cards: _2ndPlayerCards || createUnluckyPlayerDeck(),
    },
    {
      playerId: 3,
      cards: _3rdPlayerCards || createUnluckyPlayerDeck(),
    },
    {
      playerId: 4,
      cards: _4thPlayerCards || createUnluckyPlayerDeck(),
    },
  ];
}

export function get29GameCards(_1stHand: IPlayerCards[]): IPlayerCards[] {
  let left29GameCards: ICard[] = shuffle(
    differenceBy(
      cards.filter((card) => card.isValid29GameCard),
      _1stHand
        .reduce((acc: ICard[], data) => [...acc, ...data.cards], [])
        .filter((card) => card.isValid29GameCard),
      "id"
    )
  );

  const sortedLuckyPlayers = _1stHand
    .map((data) => {
      const _1stHandRank =
        data.cards.reduce((acc, card) => acc + card["29GameCardRank"], 0) *
        data.cards.reduce(
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

  function createUnluckyPlayerDeck(): ICard[] {
    const playerCards = chunk(left29GameCards, 4)[0];
    left29GameCards = differenceBy(left29GameCards, playerCards, "id");

    return shuffle(playerCards);
  }

  function createLuckyPlayerDeck(): ICard[] {
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

    return shuffle([...extraCards, ...luckySuitCards]);
  }

  let _1stPlayerCards: ICard[] | null = null;
  let _2ndPlayerCards: ICard[] | null = null;
  let _3rdPlayerCards: ICard[] | null = null;
  let _4thPlayerCards: ICard[] | null = null;

  sortedLuckyPlayers.forEach((luckyPlayer) => {
    if (luckyPlayer.playerId === 1) _1stPlayerCards = createLuckyPlayerDeck();
    if (luckyPlayer.playerId === 2) _2ndPlayerCards = createLuckyPlayerDeck();
    if (luckyPlayer.playerId === 3) _3rdPlayerCards = createLuckyPlayerDeck();
    if (luckyPlayer.playerId === 4) _4thPlayerCards = createLuckyPlayerDeck();
  });

  return [
    {
      playerId: 1,
      cards: [
        ...(_1stHand.find((deck) => deck.playerId === 1) as IPlayerCards).cards,
        ...(_1stPlayerCards || createUnluckyPlayerDeck()),
      ],
    },
    {
      playerId: 2,
      cards: [
        ...(_1stHand.find((deck) => deck.playerId === 2) as IPlayerCards).cards,
        ...(_2ndPlayerCards || createUnluckyPlayerDeck()),
      ],
    },
    {
      playerId: 3,
      cards: [
        ...(_1stHand.find((deck) => deck.playerId === 3) as IPlayerCards).cards,
        ...(_3rdPlayerCards || createUnluckyPlayerDeck()),
      ],
    },
    {
      playerId: 4,
      cards: [
        ...(_1stHand.find((deck) => deck.playerId === 4) as IPlayerCards).cards,
        ...(_4thPlayerCards || createUnluckyPlayerDeck()),
      ],
    },
  ];
}
