import joi from "joi";

import { ECurrency } from "../enums/currency.enum";
import { EModel } from "../enums/model.enum";
import { EProducer } from "../enums/producer.enum";

export class AdvertValidator {
  static price = joi.number().min(1).max(5000000);
  static userPrice = joi.valid(...Object.values(ECurrency));
  static userCurrency = joi.valid(...Object.values(ECurrency));
  static model = joi.valid(...Object.values(EModel));
  static brand = joi.valid(...Object.values(EProducer));
  static title = joi.string().min(2).max(55);
  static description = joi.string().min(50).max(999);
  static region = joi.string().min(2).max(55).trim();
  static photo = joi.object();

  static create = joi.object({
    model: this.model.required(),
    brand: this.brand.required(),
    price: this.price.required(),
    userCurrency: this.userCurrency.required(),
    title: this.title.required(),
    description: this.description.required(),
    region: this.region.required(),
  });

  static update = joi.object({
    price: this.price,
    description: this.description,
    region: this.region,
  });
}
