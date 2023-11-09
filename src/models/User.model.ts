import { model, Schema } from "mongoose";

import { ERoles} from "../enums/role.enum";
import { IUser } from "../types/user.type";
import {EUserStatus} from "../enums/user-status.enum";

const userSchema = new Schema(
    {
        name: {
            type: String,
        },
        age: {
            type: Number,
            min: [1, "Minimum age is 1"],
            max: [199, "Maximum age is 199"],
        },
        role: {
            type: String,
            enum: ERoles,
        },
        status: {
            type: String,
            enum: EUserStatus,
            required: true,
            default: EUserStatus.inactive,
        },
        email: {
            type: String,
            required: true,
            lowercase: true,
            unique: true,
            trim: true,
        },
        password: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
        versionKey: false,
    },
);

export const User = model<IUser>("user", userSchema);