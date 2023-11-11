import { ECurrency } from "../enums/currency.enum";
import { updatePriceService } from "./update-price.service";

class CurrencyConverterService {
  private exchangeRates: Record<string, number> = {};
  private initialized: boolean = false;

  async initializeExchangeRates(): Promise<void> {
    try {
      const rates = await updatePriceService.getExchangeRates();
      rates.forEach((rate) => {
        this.exchangeRates[rate.ccy] = parseFloat(rate.sale);
      });
      this.initialized = true;
    } catch (error) {
      this.initialized = false;
      console.error("Failed to initialize exchange rates:", error);
      throw error;
    }
  }

  async convertCurrency(
    amount: number,
    fromCurrency: ECurrency,
    toCurrency: ECurrency,
  ): Promise<number> {
    // Дождитесь завершения инициализации курсов валют
    if (!this.initialized) {
      await this.initializeExchangeRates();
    }

    if (!this.exchangeRates[fromCurrency] || !this.exchangeRates[toCurrency]) {
      throw new Error("Invalid currency specified");
    }

    if (fromCurrency === toCurrency) {
      return amount;
    }

    const convertedAmount =
      (amount / this.exchangeRates[fromCurrency]) *
      this.exchangeRates[toCurrency];
    return convertedAmount;
  }
}
export const currencyConverterService = new CurrencyConverterService();
