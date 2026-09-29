import { generateOtp, verifyOtp } from "../controller/otp.controller.js";
import { Router } from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { createRateLimiter } from "../middleware/rate.limiter.js";

const router = Router();

router.post(
  "/request-otp",
  protectRoute,
  createRateLimiter(
    3,
    300,
    "Too many OTP requests. Please wait a few minutes before trying again.",
  ),
  generateOtp,
);
router.post(
  "/verify-otp",
  protectRoute,
  createRateLimiter(
    5,
    900,
    "Too many OTP verification attempts. Please try again later.",
  ),
  verifyOtp,
);

export default router;
