import { Router } from "express";
import {
  PaymentController,
  createOrderSchema,
  verifyPaymentSchema,
} from "../controllers/payment.controller";
import { authenticateToken } from "../middlewares/auth";
import { validateBody } from "../middlewares/validate";

const router = Router();

// Protected user payment endpoints
router.post("/create-order", authenticateToken, validateBody(createOrderSchema), PaymentController.createOrder);
router.post("/verify", authenticateToken, validateBody(verifyPaymentSchema), PaymentController.verifyPayment);
router.get("/history", authenticateToken, PaymentController.getHistory);

// Public Razorpay Webhook endpoint
router.post("/webhook", PaymentController.handleWebhook);

export default router;
