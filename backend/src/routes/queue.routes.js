import { Router } from "express";
import { scanAndLock } from "../controller/queue.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/queue-verification", protectRoute, scanAndLock);

export default router;
