import {
  getWebEmployee,
  updateRole,
  requestRole,
  deactivateUser,
  activateUser,
  deleteUser,
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
  // createRateLimiter(
  //   3,
  //   60, // 1 minute
  //   "Too many requests to get employees. Please wait a few minutes before trying again.",
  // ),
  getWebEmployee,
);

router.post(
  "/request-role-change",
  protectRoute,
  authorizeRole("staff"),
  createRateLimiter(
    5,
    60, // 1 minute
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
    60, // 1 minute
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
    60, // 1 minute
    "Too many deactivation requests. Please try again later.",
  ),
  deactivateUser,
);

router.put(
  "/activate/:id",
  protectRoute,
  authorizeRole("super_admin"),
  createRateLimiter(
    5,
    60, // 1 minute
    "Too many activation requests. Please try again later.",
  ),
  activateUser,
);

router.delete(
  "/delete/:id",
  protectRoute,
  authorizeRole("super_admin"),
  createRateLimiter(
    5,
    60, // 1 minute
    "Too many delete requests. Please try again later.",
  ),
  deleteUser,
);

export default router;
