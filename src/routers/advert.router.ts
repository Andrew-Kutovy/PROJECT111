import { Router } from "express";

import { advertController } from "../controllers/advert.controller";
import { advertMiddleware } from "../middlewares/advert.middlevare";
import { authMiddleware } from "../middlewares/auth.middleware";
import { commonMiddleware } from "../middlewares/common.middleware";
import { filesMiddleware } from "../middlewares/files.middleware";
import { roleMiddleware } from "../middlewares/role.middleware";
import { AdvertValidator } from "../validators/advert.validator";

const router = Router();

router.get("/", advertController.getAll);

router.post(
  "/",
  authMiddleware.checkAccessToken,
  roleMiddleware.isSeller,
  advertMiddleware.existingCars,
  advertMiddleware.censorship,
  advertMiddleware.checkModel,
  advertMiddleware.checkBrand,
  commonMiddleware.isBodyValid(AdvertValidator.create),
  advertController.createAdvert,
);

router.get(
  "/:advertId",
  commonMiddleware.isIdValid("advertId"),
  advertMiddleware.getByIdOrThrow,
  advertController.getById,
);

router.put(
  "/:advertId",
  authMiddleware.checkAccessToken,
  commonMiddleware.isIdValid("advertId"),
  commonMiddleware.isBodyValid(AdvertValidator.update),
  advertController.updateAdvert,
);
router.delete(
  "/:advertId",
  authMiddleware.checkAccessToken,
  commonMiddleware.isIdValid("advertId"),
  advertController.deleteAdvert,
);
router.post(
  "/:advertId/photo",
  authMiddleware.checkAccessToken,
  filesMiddleware.isPhotoValid,
  advertController.uploadPhoto,
);
router.get(
  "/statistic/:advertId",
  authMiddleware.checkAccessToken,
  advertMiddleware.checkStatus,
  roleMiddleware.isSeller,
  advertController.getStatistic,
);

export const advertRouter = router;
