import { ECurrency } from "../enums/currency.enum";
import { updatePriceService } from "./update-price.service";

class CurrencyConverterService {
  public async convertCurrency(userCurrency: ECurrency, userPrice: number) {
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

    return { priceInEUR, priceInUSD, priceInUAH, rateUSD };
  }
}
export const currencyConverterService = new CurrencyConverterService();
