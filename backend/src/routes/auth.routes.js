import { Router } from "express";

import {
  register,
  login,
  logout,
  checkAuth,
  fetchUserProfile,
  updateUserProfile,
  userUpdatePassword,
  updateUserProfilePicture,
} from "../controller/auth.controller.js";
import {
  validateResult,
  registerValidationRules,
  loginValidationRules,
  updateProfileDetails,
  changePasswordValidationRules,
} from "../middleware/auth.validation.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import { createRateLimiter } from "../middleware/rate.limiter.js";

import multer from "multer";

const router = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

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
router.put(
  "/update-profile-picture",
  protectRoute,
  createRateLimiter(
    3,
    3600,
    "Too many upload attempts. Please try again after an hour.",
  ),
  upload.single("image"),
  updateUserProfilePicture,
);

export default router;
