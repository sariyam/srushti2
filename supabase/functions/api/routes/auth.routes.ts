import { Router } from "express";
import {
  AuthController,
  sendOtpSchema,
  verifyOtpSchema,
  refreshTokenSchema,
} from "../controllers/auth.controller";
import { authenticateToken } from "../middlewares/auth";
import { validateBody } from "../middlewares/validate";
import { avatarUploadMiddleware } from "../middlewares/upload";

const router = Router();

// Public OTP & JWT endpoints
router.post("/otp/send", validateBody(sendOtpSchema), AuthController.sendOtp);
router.post("/otp/verify", validateBody(verifyOtpSchema), AuthController.verifyOtp);
router.post("/refresh", validateBody(refreshTokenSchema), AuthController.refreshToken);

// Protected profile & avatar endpoints
router.get("/me", authenticateToken, AuthController.getProfile);
router.post("/avatar", authenticateToken, avatarUploadMiddleware, AuthController.uploadAvatar);
router.delete("/avatar", authenticateToken, AuthController.deleteAvatar);

export default router;
