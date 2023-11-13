import { Document } from "mongoose";

import { EBrand } from "../enums/brand.enum";
import { ECurrency } from "../enums/currency.enum";
import { EModel } from "../enums/model.enum";

export interface IAdvert extends Document {
  title: string;
  description: string;
  price: number;
  currency: ECurrency;
  region: string;
  brand: EBrand;
  model: EModel;
  userCurrency: ECurrency;
  userPrice?: number;
  priceInEUR?: number;
  priceInUSD?: number;
  priceInUAH?: number;
  convertedPrice?: number;
  exchangeRate?: number;
  lastPriceUpdate?: Date;
  photo?: string;
}
