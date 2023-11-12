import { Document } from "mongoose";

import { ERoles } from "../enums/role.enum";
import { EUserStatus } from "../enums/user-status.enum";

export interface IUser extends Document {
  name?: string;
  role?: ERoles;
  email: string;
  password: string;
  status: EUserStatus;
  Ads?: number;
  incrementAdsCount: () => void;
}

export type IUserCredentials = Pick<IUser, "email" | "password">;
