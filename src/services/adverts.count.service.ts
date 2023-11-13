import { NextFunction, Request, Response } from "express";

import { User } from "../models/User.model";

class AdvertsCountService {
  public async advertsCounter(req: Request, res: Response, next: NextFunction) {
    const { userId } = req.res.locals.tokenPayload;
    const user = await User.findById(userId);

    if (user) {
      user.incrementAdsCount();
      await user.save();
    }
  }
}

export const advertsCountService = new AdvertsCountService();
