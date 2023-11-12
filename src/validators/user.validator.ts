import joi from "joi";

import { regexConstant } from "../constants/regex.constant";
import { ERoles } from "../enums/role.enum";

export class UserValidator {
  static firstName = joi.string().min(2).max(50).trim();
  static role = joi.valid(...Object.values(ERoles));
  static email = joi.string().regex(regexConstant.EMAIL).trim();
  static password = joi.string().regex(regexConstant.PASSWORD).trim();

  static create = joi.object({
    name: this.firstName.required(),
    role: this.role.required(),
    email: this.email.required(),
    password: this.password.required(),
  });

  static update = joi.object({
    name: this.firstName,
  });

  static register = joi.object({
    name: this.firstName.required(),
    email: this.email.required(),
    password: this.password.required(),
  });

  static sellerRegister = joi.object({
    name: this.firstName.required(),
    role: this.role.required(),
    email: this.email.required(),
    password: this.password.required(),
  });

  static login = joi.object({
    email: this.email.required(),
    password: this.password.required(),
  });
}
