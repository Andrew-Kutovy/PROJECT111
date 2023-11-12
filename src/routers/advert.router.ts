import { Router } from "express";

import { advertController } from "../controllers/advert.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { filesMiddleware } from "../middlewares/files.middleware";

const router = Router();

router.get("/", advertController.getAll);

router.post(
  "/",
  authMiddleware.checkAccessToken,
  //commonMiddleware.isBodyValid(AdvertValidator.create), // Todo advert body validate
  advertController.createAdvert,
);

router.get(
  "/:advertId",
  //commonMiddleware.isIdValid("advertId"),
  //advertMiddleware.getByIdOrThrow,
  advertController.getById,
);

router.put(
  "/:advertId",
  authMiddleware.checkAccessToken,
  //commonMiddleware.isIdValid("advertId"),
  //commonMiddleware.isBodyValid(AdvertValidator.update),
  advertController.updateAdvert,
);
router.delete(
  "/:advertId",
  authMiddleware.checkAccessToken,
  //commonMiddleware.isIdValid("advertId"),
  advertController.deleteAdvert,
);
router.post(
  "/:advertId/photo",
  filesMiddleware.isPhotoValid,
  advertController.uploadPhoto,
);

export const advertRouter = router;
