import { Document } from "mongoose";

import { ERoles} from "../enums/role.enum";

export interface IUser extends Document {
    name?: string;
    age?: number;
    role?: ERoles;
    email: string;
    password: string;
}

export type IUserCredentials = Pick<IUser, "email" | "password">;