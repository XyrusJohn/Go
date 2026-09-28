import { Router } from "express";

import {
  getSapData,
  shipmentRegistration,
  getShipmentAssignment,
  getShipmentMetrics,
} from "../controller/sap.request.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/get-sap-data", protectRoute, getSapData);
router.post("/shipment-registration", protectRoute, shipmentRegistration);
router.get("/shipment-assignment", protectRoute, getShipmentAssignment);
router.get("/metrics", protectRoute, getShipmentMetrics);

export default router;
