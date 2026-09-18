import Razorpay from "razorpay";
import crypto from "node:crypto";
import { db, env } from "../config";
import { payments, users } from "../config/schema";
import { eq, sql } from "drizzle-orm";
import { BadRequestError, NotFoundError, ExternalServiceError } from "../utils/errors";

export interface CreateOrderParams {
  userId: string;
  amount: number; // in INR (e.g. 299 for ₹299)
  credits: number; // credits to add upon completion
  packName?: string;
  notes?: Record<string, string>;
}

export interface VerifyPaymentParams {
  userId: string;
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
}

export class RazorpayService {
  private static instance: Razorpay;

  private static getClient(): Razorpay {
    if (!this.instance) {
      if (!env.RAZORPAY_KEY_ID || !env.RAZORPAY_KEY_SECRET) {
        throw new ExternalServiceError("Razorpay", "Razorpay credentials (RAZORPAY_KEY_ID / RAZORPAY_KEY_SECRET) are missing.");
      }
      this.instance = new Razorpay({
        key_id: env.RAZORPAY_KEY_ID,
        key_secret: env.RAZORPAY_KEY_SECRET,
      });
    }
    return this.instance;
  }

  /**
   * Generates a new Razorpay order and logs it in the payments table
   */
  static async createOrder({ userId, amount, credits, packName, notes }: CreateOrderParams) {
    const rzp = this.getClient();
    const amountInPaise = Math.round(amount * 100);

    const receipt = `rcpt_${Date.now()}_${userId.slice(0, 5)}`;

    try {
      const rzpOrder = await rzp.orders.create({
        amount: amountInPaise,
        currency: "INR",
        receipt,
        notes: {
          userId,
          credits: credits.toString(),
          packName: packName || "Credit Recharge",
          ...notes,
        },
      });

      // Save pending payment record in database
      const [paymentRecord] = await db
        .insert(payments)
        .values({
          userId,
          razorpayOrderId: rzpOrder.id,
          amount: amountInPaise,
          currency: "INR",
          status: "created",
          creditsAdded: credits,
          metadata: {
            packName,
            notes,
          },
        })
        .returning();

      return {
        orderId: rzpOrder.id,
        amount: rzpOrder.amount,
        currency: rzpOrder.currency,
        keyId: env.RAZORPAY_KEY_ID,
        configId: env.RAZORPAY_CHECKOUT_CONFIG_ID || "config_SVPwn8f33zfhsP",
        credits,
        paymentId: paymentRecord.id,
      };
    } catch (err: any) {
      if (err instanceof ExternalServiceError) throw err;
      throw new ExternalServiceError("Razorpay", err?.error?.description || err?.message || "Failed to create order with Razorpay.");
    }
  }

  /**
   * Verifies Razorpay payment signature and credits the user's wallet atomically
   */
  static async verifyPayment({
    userId,
    razorpayOrderId,
    razorpayPaymentId,
    razorpaySignature,
  }: VerifyPaymentParams) {
    // 1. Verify HMAC SHA256 signature
    const generatedSignature = crypto
      .createHmac("sha256", env.RAZORPAY_KEY_SECRET)
      .update(`${razorpayOrderId}|${razorpayPaymentId}`)
      .digest("hex");

    if (generatedSignature !== razorpaySignature) {
      // Mark as failed
      await db
        .update(payments)
        .set({ status: "failed", razorpayPaymentId, razorpaySignature })
        .where(eq(payments.razorpayOrderId, razorpayOrderId));

      throw new BadRequestError(
        "Invalid payment signature. Verification failed.",
        { razorpayOrderId, razorpayPaymentId },
        "PAYMENT_SIGNATURE_MISMATCH"
      );
    }

    // 2. Fetch payment record
    const [existingPayment] = await db
      .select()
      .from(payments)
      .where(eq(payments.razorpayOrderId, razorpayOrderId))
      .limit(1);

    if (!existingPayment) {
      throw new NotFoundError(
        `Payment order with Razorpay ID '${razorpayOrderId}' was not found.`,
        undefined,
        "PAYMENT_ORDER_NOT_FOUND"
      );
    }

    if (existingPayment.status === "paid") {
      // Already credited (idempotency)
      const [currentUser] = await db
        .select()
        .from(users)
        .where(eq(users.id, userId))
        .limit(1);

      return {
        success: true,
        alreadyProcessed: true,
        walletBalance: currentUser?.walletBalance ?? 0,
      };
    }

    // 3. Atomically update payment status & increment wallet balance
    const creditsToAdd = existingPayment.creditsAdded;

    await db.transaction(async (tx) => {
      await tx
        .update(payments)
        .set({
          status: "paid",
          razorpayPaymentId,
          razorpaySignature,
          updatedAt: new Date(),
        })
        .where(eq(payments.id, existingPayment.id));

      await tx
        .update(users)
        .set({
          walletBalance: sql`${users.walletBalance} + ${creditsToAdd}`,
          updatedAt: new Date(),
        })
        .where(eq(users.id, userId));
    });

    const [updatedUser] = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    return {
      success: true,
      creditsAdded: creditsToAdd,
      walletBalance: updatedUser.walletBalance,
      orderId: razorpayOrderId,
      paymentId: razorpayPaymentId,
    };
  }

  /**
   * Razorpay Webhook processor for automated server-to-server confirmation
   */
  static async handleWebhook(body: any, signature: string) {
    if (!env.RAZORPAY_WEBHOOK_SECRET) return { status: "ignored" };

    const expectedSignature = crypto
      .createHmac("sha256", env.RAZORPAY_WEBHOOK_SECRET)
      .update(typeof body === "string" ? body : JSON.stringify(body))
      .digest("hex");

    if (expectedSignature !== signature) {
      throw new Error("Invalid webhook signature");
    }

    const event = body.event;
    if (event === "payment.captured" || event === "order.paid") {
      const paymentEntity = body.payload?.payment?.entity;
      const orderId = paymentEntity?.order_id;
      const paymentId = paymentEntity?.id;
      const userId = paymentEntity?.notes?.userId;
      const credits = Number(paymentEntity?.notes?.credits || 0);

      if (orderId && userId && credits > 0) {
        await db.transaction(async (tx) => {
          await tx
            .update(payments)
            .set({ status: "paid", razorpayPaymentId: paymentId, updatedAt: new Date() })
            .where(eq(payments.razorpayOrderId, orderId));

          await tx
            .update(users)
            .set({ walletBalance: sql`${users.walletBalance} + ${credits}`, updatedAt: new Date() })
            .where(eq(users.id, userId));
        });
      }
    }

    return { received: true };
  }
}
