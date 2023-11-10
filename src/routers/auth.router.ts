import { Router } from "express";

import { authController } from "../controllers/auth.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { commonMiddleware } from "../middlewares/common.middleware";
import { userMiddleware } from "../middlewares/user.middleware";
import { UserValidator } from "../validators/user.validator";

const router = Router();

router.post(
  "/register",
  commonMiddleware.isBodyValid(UserValidator.register),
  userMiddleware.isEmailUniq, //have one problem with find by email. Alredy return - "email alredy exist"!!((
  authController.register,
);
router.post(
  "/login",
  commonMiddleware.isBodyValid(UserValidator.login),
  authController.login,
);

router.post("/refresh", authMiddleware.checkRefreshToken, authController.login);

router.post("/logout", authMiddleware.checkAccessToken, authController.logout);
router.post(
  "/logout-all",
  authMiddleware.checkAccessToken,
  authController.logoutAll,
);
router.put("/activate", authController.activate);
export const authRouter = router;
