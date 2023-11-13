import { NextFunction, Request, Response } from "express";

import { ApiError } from "../errors/api.error";
import { Advert } from "../models/Advert.model";

class StatisticService {
  public async getStatistic(req: Request, res: Response, next: NextFunction) {
    try {
      const { advertId } = req.params;
      const advert = await Advert.findById(advertId);

      if (!advert) {
        throw new ApiError("Оголошення не знайдено", 404);
      }

      // Вместо реальных данных о просмотрах используем заглушку
      const views = advert ? advert.get("views") || 0 : 0;

      // Также, давайте убедимся, что у нас есть корректные значения цен
      const userPrice: number = req.body.price || 0;
      const priceInEUR: number = req.body.priceInEUR || 0;
      const priceInUSD: number = req.body.priceInUSD || 0;
      const priceInUAH: number = req.body.priceInUAH || 0;

      const calculateAveragePrice = (cars: Array<{ price: number }>) => {
        const totalPrices = cars.reduce((total, car) => total + car.price, 0);
        return cars.length > 0 ? totalPrices / cars.length : 0;
      };

      const regionCars = await Advert.find({ model: advert.model }).lean();
      const ukraineCars = await Advert.find({}).lean();

      const averageRegionPrice = calculateAveragePrice(regionCars);
      const averageUkrainePrice = calculateAveragePrice(ukraineCars);

      res.json({
        views,
        averageRegionPrice,
        averageUkrainePrice,
        userPrice,
        priceInEUR,
        priceInUSD,
        priceInUAH,
      });
    } catch (e) {
      new ApiError(e.message, 500);
    }
  }
}

export const statisticService = new StatisticService();
