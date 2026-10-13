import { Request, Response } from "express";
import { RazorpayService } from "../services/razorpay.service";
import { db } from "../config";
import { payments } from "../config/schema";
import { eq, desc } from "drizzle-orm";
import { UnauthorizedError, BadRequestError, asyncHandler } from "../utils";

export {
  createOrderSchema,
  verifyPaymentSchema,
  CreateOrderSchema,
  VerifyPaymentSchema,
} from "../schemas/payment.schema";

export class PaymentController {
  static createOrder = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
      throw new UnauthorizedError();
    }

    const { amount, credits, packName, notes } = req.body;
    const order = await RazorpayService.createOrder({
      userId: req.user.userId,
      amount,
      credits,
      packName,
      notes,
    });

    return res.status(200).json({ success: true, order });
  });

  static verifyPayment = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
      throw new UnauthorizedError();
    }

    const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;
    const result = await RazorpayService.verifyPayment({
      userId: req.user.userId,
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
    });

    return res.status(200).json(result);
  });

  static getHistory = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
      throw new UnauthorizedError();
    }

    const limit = Math.min(Math.max(1, Number(req.query.limit) || 20), 100);
    const offset = Math.max(0, Number(req.query.offset) || 0);

    const records = await db
      .select()
      .from(payments)
      .where(eq(payments.userId, req.user.userId))
      .orderBy(desc(payments.createdAt))
      .limit(limit)
      .offset(offset);

    return res.status(200).json({ success: true, payments: records });
  });

  static handleWebhook = asyncHandler(async (req: Request, res: Response) => {
    const signature = req.headers["x-razorpay-signature"] as string;
    if (!signature) {
      throw new BadRequestError("Missing 'x-razorpay-signature' header in webhook request", undefined, "MISSING_WEBHOOK_SIGNATURE");
    }

    const result = await RazorpayService.handleWebhook(req.body, signature);
    return res.status(200).json(result);
  });
}
