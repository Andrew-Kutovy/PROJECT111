import { CronJob } from "cron";

import { updatePriceService } from "../services/update-price.service";

const pricesUpdater = async function () {
  try {
    await updatePriceService.runDailyUpdate();
  } catch (error) {
    console.error("Failed to update prices:", error);
  }
};

export const updatePrices = new CronJob("0 7 * * *", pricesUpdater);
