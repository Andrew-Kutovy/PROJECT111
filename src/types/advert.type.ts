import { Document } from "mongoose";

import { ECurrency } from "../enums/currency.enum";

export interface IAdvert extends Document {
  title: string;
  description: string;
  price: number;
  currency: ECurrency;
  region: string;
  brand: string;
  model: string;
  userCurrency: ECurrency;
  userPrice: number;
  priceInEUR?: number;
  priceInUSD?: number;
  priceInUAH?: number;
  convertedPrice: number;
  exchangeRate: number;
  lastPriceUpdate: Date;
  photo: string;
}
