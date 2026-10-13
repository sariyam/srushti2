import { Router } from "express";
import { AiController, generateAiImageSchema } from "../controllers/ai.controller";
import { authenticateToken } from "../middlewares/auth";
import { validateBody } from "../middlewares/validate";

const router = Router();

// Protected AI Image Generation endpoint
router.post(
  "/generate",
  authenticateToken,
  validateBody(generateAiImageSchema),
  AiController.generate
);

export default router;
