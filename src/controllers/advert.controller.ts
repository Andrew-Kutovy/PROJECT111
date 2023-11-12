import { NextFunction, Request, Response } from "express";
import { UploadedFile } from "express-fileupload";

import { ECurrency } from "../enums/currency.enum";
import { advertService } from "../services/advert.service";
import { updatePriceService } from "../services/update-price.service";
import { IAdvert } from "../types/advert.type";
import { ITokenPayload } from "../types/token.types";
import {advertPresenter} from "../presenters/advert.presenter";

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

      // Перевірка валідності введених даних
      if (!Object.values(ECurrency).includes(userCurrency)) {
        throw new Error("Invalid currency specified");
      }

      // Отримання курсів валют з API Приватбанку
      const exchangeRates = await updatePriceService.getExchangeRates();

      // Виконання конвертації валют для всіх трьох валют
      const rateEUR = exchangeRates.find((item) => item.ccy === ECurrency.EUR);
      const rateUSD = exchangeRates.find((item) => item.ccy === ECurrency.USD);

      const priceInEUR =
        userCurrency !== ECurrency.EUR
          ? userPrice / parseFloat(rateEUR?.buy || "1")
          : userPrice;

      const priceInUSD =
        userCurrency !== ECurrency.USD
          ? userPrice / parseFloat(rateUSD?.buy || "1")
          : userPrice;

      const priceInUAH =
        userCurrency !== ECurrency.UAH
          ? userPrice * parseFloat(rateUSD?.sale || "1")
          : userPrice;

      // Збереження оголошення з конвертованою ціною та курсом
      const advertData: IAdvert = {
        ...req.body,
        convertedPrice: userPrice,
        priceInEUR,
        priceInUSD,
        priceInUAH,
        exchangeRate: parseFloat(rateUSD?.sale || "1"),
      };

      const advert = await advertService.createAdvert(advertData, userId);

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

  public async uploadPhoto(req: Request, res: Response, next: NextFunction): Promise<Response<IAdvert>> {
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
