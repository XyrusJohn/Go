import { Router } from "express";

import {
  register,
  login,
  logout,
  checkAuth,
  fetchUserProfile,
  updateUserProfile,
  userUpdatePassword,
} from "../controller/auth.controller.js";
import {
  validateResult,
  registerValidationRules,
  loginValidationRules,
  updateProfileDetails,
  changePasswordValidationRules,
} from "../middleware/auth.validation.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/register", registerValidationRules, validateResult, register);
router.post("/login", loginValidationRules, validateResult, login);
router.post("/logout", logout);

router.get("/check", protectRoute, checkAuth);
router.get("/profile", protectRoute, fetchUserProfile);

router.put(
  "/profile-update",
  protectRoute,
  updateProfileDetails,
  validateResult,
  updateUserProfile,
);
router.put(
  "/update-password",
  protectRoute,
  changePasswordValidationRules,
  validateResult,
  userUpdatePassword,
);

export default router;
