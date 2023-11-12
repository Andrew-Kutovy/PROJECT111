import { model, Schema } from "mongoose";

import { ERoles } from "../enums/role.enum";
import { EUserStatus } from "../enums/user-status.enum";
import { IUser } from "../types/user.type";

const userSchema = new Schema(
  {
    name: {
      type: String,
    },
    role: {
      type: String,
      enum: ERoles,
      default: ERoles.buyer,
    },
    status: {
      type: String,
      enum: EUserStatus,
      required: true,
      default: EUserStatus.base,
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
      selected: false,
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const User = model<IUser>("user", userSchema);
