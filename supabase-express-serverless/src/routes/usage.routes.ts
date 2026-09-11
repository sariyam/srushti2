import { Router } from "express";
import { UsageController, recordUsageSchema } from "../controllers/usage.controller";
import { authenticateToken } from "../middlewares/auth";
import { validateBody } from "../middlewares/validate";

const router = Router();

// Protected AI usage tracking endpoints
router.post("/record", authenticateToken, validateBody(recordUsageSchema), UsageController.recordUsage);
router.get("/history", authenticateToken, UsageController.getHistory);
router.get("/balance", authenticateToken, UsageController.getBalance);
router.get("/timeline", authenticateToken, UsageController.getTimeline);

export default router;
