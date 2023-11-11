import { updatePrices } from "./update-price.cron";

export const cronRunner = () => {
  updatePrices.start();
};
