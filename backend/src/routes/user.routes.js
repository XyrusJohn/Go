import {
  getWebEmployee,
  updateRole,
  requestRole,
  deactivateUser,
} from "../controller/user.controller.js";
import { Router } from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { authorizeRole } from "../middleware/role.middleware.js";

import { createRateLimiter } from "../middleware/rate.limiter.js";

const router = Router();

router.get(
  "/employees",
  protectRoute,
  authorizeRole("super_admin", "admin", "staff"),
  createRateLimiter(
    3,
    300, // 5 minutes
    "Too many OTP requests. Please wait a few minutes before trying again.",
  ),
  getWebEmployee,
);

router.post(
  "/request-role-change",
  protectRoute,
  authorizeRole("staff"),
  createRateLimiter(
    5,
    300, // 5 minutes
    "Too many requests for role change. Please try again later.",
  ),
  requestRole,
);

router.put(
  "/role-change/:id",
  protectRoute,
  authorizeRole("super_admin", "admin"),
  createRateLimiter(
    5,
    300, // 5 minutes
    "Too many role change requests. Please try again later.",
  ),
  updateRole,
);

router.put(
  "/deactivate/:id",
  protectRoute,
  authorizeRole("super_admin"),
  createRateLimiter(
    5,
    300, // 5 minutes
    "Too many deactivation requests. Please try again later.",
  ),
  deactivateUser,
);

export default router;
