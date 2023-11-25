import { model, Schema, Types } from "mongoose";

import { EBrand } from "../enums/brand.enum";
import { ECurrency } from "../enums/currency.enum";
import { EModel } from "../enums/model.enum";
import { IAdvert } from "../types/advert.type";
import { User } from "./User.model";

const advertSchema = new Schema(
  {
    title: {
      type: String,
    },
    description: {
      type: String,
    },
    price: {
      type: Number,
      min: [1, "Minimum price is 1"],
      max: [2000000, "Maximum price is 2000000"],
    },
    currency: {
      type: String,
      enum: ECurrency,
      required: true,
    },
    region: {
      type: String,
      required: true,
    },
    brand: {
      type: String,
      enum: EBrand,
      required: true,
    },
    model: {
      type: String,
      enum: EModel,
      required: true,
    },
    priceInEUR: {
      type: Number,
    },
    priceInUSD: {
      type: Number,
    },
    priceInUAH: {
      type: Number,
    },
    exchangeRate: {
      type: Number,
    },
    lastPriceUpdate: {
      type: Date,
      default: Date.now,
    },
    _userId: {
      type: Types.ObjectId,
      ref: User,
      required: true,
    },
    photo: {
      type: String,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const Advert = model<IAdvert>("advert", advertSchema);
