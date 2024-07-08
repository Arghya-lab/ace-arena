import { Document, Schema } from "mongoose";
import { CardRankEnum, ICard, SuitsEnum } from "../@types/card";

export type ICardDocument = ICard & Document;

const cardSchema = new Schema<ICardDocument>({
  id: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  suit: {
    type: String,
    enum: Object.values(SuitsEnum),
    required: true,
  },
  rank: {
    type: String,
    enum: Object.values(CardRankEnum),
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  textImg: {
    type: String,
    required: true,
  },
  isValid29GameCard: {
    type: Boolean,
    required: true,
  },
  "29GameCardRank": {
    type: Number,
    enum: [-1, 1, 2, 3, 4, 5, 6, 7, 8],
    default: -1,
  }, // J=>1, 9=>2, A=>3, 10=>4, K=>5, Q=>6, 8=>7, 7=>8
  "29GameCardPoint": {
    type: Number,
    enum: [0, 1, 2, 3],
    default: 0,
  },
});

export default cardSchema;
