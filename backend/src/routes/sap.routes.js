import { Router } from "express";

import {
  getSapData,
  shipmentRegistration,
  getShipmentAssignment,
  getShipmentMetrics,
} from "../controller/sap.request.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

import { createRateLimiter } from "../middleware/rate.limiter.js";

const router = Router();

router.get(
  "/get-sap-data",
  protectRoute,
  createRateLimiter(
    10,
    60,
    "Too many SAP data requests. Please wait 60 seconds to continue.",
  ),
  getSapData,
);
router.post(
  "/shipment-registration",
  protectRoute,
  createRateLimiter(
    5,
    60,
    "Too many shipment registration requests. Please wait 60 seconds to continue.",
  ),
  shipmentRegistration,
);
router.get(
  "/shipment-assignment",
  protectRoute,
  createRateLimiter(
    30,
    60,
    "Too many shipment assignment requests. Please wait 60 seconds to continue.",
  ),
  getShipmentAssignment,
);
router.get(
  "/metrics",
  protectRoute,
  createRateLimiter(
    10,
    60,
    "Too many metrics requests. Please wait 60 seconds to continue.",
  ),
  getShipmentMetrics,
);

export default router;
