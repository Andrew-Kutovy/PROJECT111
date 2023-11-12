import { Document, Types } from "mongoose";

import { EActionTokenType } from "../enums/actionTokenType.enum";
import { IUser } from "./user.type";
import {ERoles} from "../enums/role.enum";

export interface ITokenPayload {
  userId: string;
  name: string;
}

export interface ITokenAndRolePayload extends ITokenPayload {
  role: ERoles;
}

export interface ITokensPair {
  accessToken: string;
  refreshToken: string;
}

export interface IToken extends Document {
  accessToken: string;
  refreshToken: string;
  _userId: Types.ObjectId | IUser;
}

export interface IActionTokenDocument extends Document {
  token: string;
  type: EActionTokenType;
  _userId: Types.ObjectId | IUser;
}

export interface IActionToken
  extends Pick<IActionTokenDocument, "token" | "type" | "_userId"> {}
