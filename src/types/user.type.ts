import { Document } from "mongoose";

import { ERoles} from "../enums/role.enum";
import {EUserStatus} from "../enums/user-status.enum";

export interface IUser extends Document {
    name?: string;
    age?: number;
    role?: ERoles;
    email: string;
    password: string;
    status: EUserStatus;
}

export type IUserCredentials = Pick<IUser, "email" | "password">;