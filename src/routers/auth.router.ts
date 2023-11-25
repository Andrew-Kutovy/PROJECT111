import { Router } from "express";

import { authController } from "../controllers/auth.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { commonMiddleware } from "../middlewares/common.middleware";
import { roleMiddleware } from "../middlewares/role.middleware";
import { userMiddleware } from "../middlewares/user.middleware";
import { UserValidator } from "../validators/user.validator";

const router = Router();

router.post(
  "/register",
  commonMiddleware.isBodyValid(UserValidator.register),
  userMiddleware.isEmailUniq,
  authController.register,
);
router.post(
  "/register/seller",
  commonMiddleware.isBodyValid(UserValidator.sellerRegister),
  userMiddleware.isEmailUniq,
  roleMiddleware.isSeller,
  authController.register,
);
router.post(
  "/register/manager",
  authMiddleware.checkAccessAdminToken,
  commonMiddleware.isBodyValid(UserValidator.sellerRegister),
  roleMiddleware.isManager,
  userMiddleware.isEmailUniq,
  authController.register,
);
router.post(
  "/register/admin",
  commonMiddleware.isBodyValid(UserValidator.sellerRegister),
  roleMiddleware.isAdmin,
  userMiddleware.isEmailUniq,
  authController.register,
);
router.post("/login",
  commonMiddleware.isBodyValid(UserValidator.login),
  authController.login,
);
router.post("/refresh",
  authMiddleware.checkRefreshToken,
  authController.refresh,
);
router.post("/logout",
    authMiddleware.checkAccessToken, authController.logout
);
router.put("/activate", authController.activate);
export const authRouter = router;
