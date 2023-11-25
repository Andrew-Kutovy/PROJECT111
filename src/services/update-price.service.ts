import axios from "axios";

import { Advert } from "../models/Advert.model";
import {configs} from "../configs/configs";

class UpdatePriceService {
  async updatePrices(): Promise<void> {
    try {
      const exchangeRates = await this.getExchangeRates();
      const adverts = await Advert.find();

      for (const advert of adverts) {
        const userCurrency = advert.userCurrency;
        const rate = exchangeRates.find((item) => item.ccy === userCurrency);

        if (rate) {
          const newPrice = advert.userPrice * parseFloat(rate.sale);
          advert.price = newPrice;
          advert.exchangeRate = parseFloat(rate.sale);
          advert.lastPriceUpdate = new Date();

          await advert.save();
        }
      }
    } catch (error) {
      console.error("Failed to update prices:", error);
    }
  }

  public async getExchangeRates(): Promise<any[]> {
    try {
      const response = await axios.get(configs.BANK_API);
      return response.data;
    } catch (error) {
      throw new Error(
        "Failed to fetch exchange rates from Privatbank API: " + error.message,
      );
    }
  }

  async runDailyUpdate(): Promise<void> {
    try {
      await this.updatePrices();
    } catch (error) {
      console.error("Failed to run daily update:", error);
    }
  }
}

export const updatePriceService = new UpdatePriceService();
