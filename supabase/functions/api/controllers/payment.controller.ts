import { Request, Response, NextFunction } from "express";
import { RazorpayService } from "../services/razorpay.service";
import { db } from "../config";
import { payments } from "../config/schema";
import { eq, desc } from "drizzle-orm";
import { z } from "zod";

export const createOrderSchema = z.object({
  amount: z.number().positive("Amount must be greater than 0"),
  credits: z.number().int().positive("Credits must be greater than 0"),
  packName: z.string().optional(),
  notes: z.record(z.string()).optional(),
});

export const verifyPaymentSchema = z.object({
  razorpayOrderId: z.string().min(1, "razorpayOrderId is required"),
  razorpayPaymentId: z.string().min(1, "razorpayPaymentId is required"),
  razorpaySignature: z.string().min(1, "razorpaySignature is required"),
});

export class PaymentController {
  static async createOrder(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return res.status(401).json({ success: false, error: "Unauthorized" });
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
    } catch (error: any) {
      next(error);
    }
  }

  static async verifyPayment(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return res.status(401).json({ success: false, error: "Unauthorized" });
      }

      const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;
      const result = await RazorpayService.verifyPayment({
        userId: req.user.userId,
        razorpayOrderId,
        razorpayPaymentId,
        razorpaySignature,
      });

      return res.status(200).json(result);
    } catch (error: any) {
      next(error);
    }
  }

  static async getHistory(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return res.status(401).json({ success: false, error: "Unauthorized" });
      }

      const limit = Number(req.query.limit) || 20;
      const offset = Number(req.query.offset) || 0;

      const records = await db
        .select()
        .from(payments)
        .where(eq(payments.userId, req.user.userId))
        .orderBy(desc(payments.createdAt))
        .limit(limit)
        .offset(offset);

      return res.status(200).json({ success: true, payments: records });
    } catch (error: any) {
      next(error);
    }
  }

  static async handleWebhook(req: Request, res: Response, next: NextFunction) {
    try {
      const signature = req.headers["x-razorpay-signature"] as string;
      const result = await RazorpayService.handleWebhook(req.body, signature || "");
      return res.status(200).json(result);
    } catch (error: any) {
      console.error("Webhook processing error:", error.message);
      return res.status(400).json({ error: error.message });
    }
  }
}
