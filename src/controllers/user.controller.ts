import { NextFunction, Request, Response } from "express";

import { EEmailAction } from "../enums/email.action.enum";
import { emailService } from "../services/email.service";
import { userService } from "../services/user.service";
import { IUser } from "../types/user.type";

class UserController {
  public async getAll(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response<IUser[]>> {
    try {
      const users = await userService.getAll();

      await emailService.sendMail(
        "andrewkutovy24@gmail.com",
        EEmailAction.REGISTER,
        { name: "Andrew" },
      );

      return res.json(users);
    } catch (e) {
      next(e);
    }
  }

  public async deleteUser(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      await userService.deleteUser(req.params.userId);

      res.sendStatus(204);
    } catch (e) {
      next(e);
    }
  }

  public async updateUser(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const user = await userService.updateUser(req.params.userId, req.body);

      res.status(201).json(user);
    } catch (e) {
      next(e);
    }
  }

  public async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const user = req.res.locals;

      res.json(user);
    } catch (e) {
      next(e);
    }
  }
}

export const userController = new UserController();
