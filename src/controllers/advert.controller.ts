import { NextFunction, Request, Response } from "express";
import { UploadedFile } from "express-fileupload";

import { ECurrency } from "../enums/currency.enum";
import { advertPresenter } from "../presenters/advert.presenter";
import { advertService } from "../services/advert.service";
import { advertsCountService } from "../services/adverts.count.service";
import { currencyConverterService } from "../services/currency-converter.service";
import { statisticService } from "../services/statistic.service";
import { IAdvert } from "../types/advert.type";
import { ITokenPayload } from "../types/token.types";

class AdvertController {
  public async createAdvert(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { userId } = req.res.locals.tokenPayload as ITokenPayload;

      const userCurrency: ECurrency = req.body.currency;
      const userPrice: number = req.body.price;

      const { priceInEUR, priceInUSD, priceInUAH, rateUSD } =
        await currencyConverterService.convertCurrency(userCurrency, userPrice);

      const advertData: IAdvert = {
        ...req.body,
        convertedPrice: userPrice,
        priceInEUR,
        priceInUSD,
        priceInUAH,
        exchangeRate: parseFloat(rateUSD?.buy || "1"), // Используем курс покупки для долларов
      };

      const advert = await advertService.createAdvert(advertData, userId);

      advertsCountService.advertsCounter(req, res, next);

      res.status(201).json(advert);
    } catch (e) {
      next(e);
    }
  }

  public async getAll(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response<IAdvert[]>> {
    try {
      const adverts = await advertService.getAll();

      return res.json(adverts);
    } catch (e) {
      next(e);
    }
  }

  public async getStatistic(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response<IAdvert[]>> {
    try {
      const statistic = await statisticService.getStatistic(req, res, next);

      return res.json(statistic);
    } catch (e) {
      next(e);
    }
  }

  public async deleteAdvert(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { userId } = req.res.locals.tokenPayload as ITokenPayload;
      await advertService.deleteAdvert(req.params.advertId, userId);

      res.sendStatus(204);
    } catch (e) {
      next(e);
    }
  }

  public async updateAdvert(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { userId } = req.res.locals.tokenPayload as ITokenPayload;
      const advert = await advertService.updateAdvert(
        req.params.advertId,
        req.body,
        userId,
      );

      res.status(201).json(advert);
    } catch (e) {
      next(e);
    }
  }

  public async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const advert = req.res.locals;

      res.json(advert);
    } catch (e) {
      next(e);
    }
  }

  public async uploadPhoto(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response<IAdvert>> {
    try {
      const { advertId } = req.params;
      const photo = req.files.photo as UploadedFile;
      const car = await advertService.uploadPhoto(photo, advertId);

      const response = advertPresenter.present(car);

      return res.json(response);
    } catch (e) {}
  }
}

export const advertController = new AdvertController();
