import { generateOtp, verifyOtp } from "../controller/otp.controller.js";
import { Router } from "express";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/request-otp", protectRoute, generateOtp);
router.post("/verify-otp", protectRoute, verifyOtp);

export default router;
