import { NextFunction, Request, Response } from "express";

import { ERoles } from "../enums/role.enum";
import { ApiError } from "../errors/api.error";
import { User } from "../models/User.model";
import { tokenRepository } from "../repositories/token.repository";
import { tokenService } from "../services/token.service";

class AuthMiddleware {
  public async checkRefreshToken(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const refreshToken = req.get("Authorization");

      if (!refreshToken) {
        throw new ApiError("No Token!", 401);
      }
      // const payload = tokenService

      const payload = tokenService.checkToken(refreshToken, "refresh");

      const entity = await tokenRepository.findOne({ refreshToken });

      if (!entity) {
        throw new ApiError("Token not valid", 401);
      }
      req.res.locals.tokenPayload = payload;
      req.res.locals.refreshToken = refreshToken;

      next();
    } catch (e) {
      next(e);
    }
  }

  public async checkAccessToken(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const accessToken = req.get("Authorization");

      if (!accessToken) {
        throw new ApiError("No Token!", 401);
      }

      const payload = tokenService.checkToken(accessToken, "access");

      const entity = await tokenRepository.findOne({ accessToken });

      if (!entity) {
        throw new ApiError("Token not valid!", 401);
      }

      req.res.locals.tokenPayload = payload;
      req.res.locals.accessToken = accessToken;
      next();
    } catch (e) {
      next(e);
    }
  }
  // try {
  //   const accessToken = req.get("Authorization");
  //   const payload = tokenService.checkToken(accessToken, "access");
  //   const user = await User.findById(payload.userId);
  //   const userRole = user.role;
  //
  //   const allowedRoles: ERoles[] = [ERoles.admin, ERoles.manager];
  //   if (!accessToken || !allowedRoles.includes(userRole)) {
  //     throw new ApiError("No Token! ", 401);
  //   }
  //
  //   const entity = await tokenRepository.findOne({ accessToken });
  //
  //   if (!entity) {
  //     throw new ApiError("Token not valid", 401);
  //   }
  //   req.res.locals.tokenPayload = payload;
  //   req.res.locals.accessToken = accessToken;
  //
  //   next();
  // } catch (e) {
  //   next(e);
  // }
  // }
  public async checkAccessTokenOrSuperUser(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const accessToken = req.get("Authorization");
      const payload = tokenService.checkToken(accessToken, "access");
      const user = await User.findById(payload.userId);

      if (!accessToken || user.role !== ERoles.admin) {
        throw new ApiError("No Token!", 401);
      }

      const entity = await tokenRepository.findOne({ accessToken });

      if (!entity) {
        throw new ApiError("Token not valid", 401);
      }
      req.res.locals.tokenPayload = payload;
      req.res.locals.accessToken = accessToken;

      next();
    } catch (e) {
      next(e);
    }
  }

  public async checkAccessAdminToken(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const accessToken = req.get("Authorization");
      const payload = tokenService.checkToken(accessToken, "access");

      const user = await User.findById(payload.userId);

      if (user.role !== ERoles.admin) {
        throw new ApiError("Only admin can create manager", 401);
      }

      next();
    } catch (e) {
      next(e);
    }
  }
}

export const authMiddleware = new AuthMiddleware();
