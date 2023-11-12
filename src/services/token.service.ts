import * as jwt from "jsonwebtoken";

import { configs } from "../configs/configs";
import { ApiError } from "../errors/api.error";
import {ITokenAndRolePayload, ITokenPayload, ITokensPair} from "../types/token.types";
import {ERoles} from "../enums/role.enum";
import {Secret} from "jsonwebtoken";

class TokenService {
  public generateTokenPair(payload: ITokenPayload): ITokensPair {
    const accessToken = jwt.sign(payload, configs.JWT_ACCESS_SECRET, {
      expiresIn: "1h",
    });
    const refreshToken = jwt.sign(payload, configs.JWT_REFRESH_SECRET, {
      expiresIn: "1h",
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  public checkToken(token: string, type: "access" | "refresh"): ITokenPayload {
    try {
      let secret: string;

      switch (type) {
        case "access":
          secret = configs.JWT_ACCESS_SECRET;
          break;
        case "refresh":
          secret = configs.JWT_REFRESH_SECRET;
          break;
      }

      return jwt.verify(token, secret) as ITokenPayload;
    } catch (e) {
      throw new ApiError("Token not valid!", 401);
    }
  }

  public checkTokenAndRole(token: string, type: 'access' | 'refresh', expectedRole: ERoles): ITokenAndRolePayload {
    try {
      let secret: string;

      switch (type) {
        case 'access':
          secret = configs.JWT_ACCESS_SECRET;
          break;
        case 'refresh':
          secret = configs.JWT_REFRESH_SECRET;
          break;
        default:
          throw new ApiError('Invalid token type', 400);
      }

      const payload = jwt.verify(token, secret) as ITokenAndRolePayload;

      if (payload.role !== expectedRole) {
        throw new ApiError('Invalid role in the token', 403);
      }

      return payload;
    } catch (e) {
      throw new ApiError('Token not valid!', 401);
    }
  }

  public generateActionToken(payload: ITokenPayload): string {
    return jwt.sign(payload, configs.JWT_ACTION_SECRET, {
      expiresIn: "1d",
    });
  }

  public checkActionToken(token: string): ITokenPayload {
    try {
      return jwt.verify(token, configs.JWT_ACTION_SECRET) as ITokenPayload;
    } catch (e) {
      throw new ApiError("Token not valid!", 401);
    }
  }
}

export const tokenService = new TokenService();
