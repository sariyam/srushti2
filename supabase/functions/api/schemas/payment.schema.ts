import { z } from "@hono/zod-openapi";
import { PaymentModel } from "../models/payment.model";

export const CreateOrderSchema = z
  .object({
    amount: z.number().positive("Amount must be greater than 0").openapi({
      description: "Payment amount in paise (e.g. 10000 = ₹100)",
      example: 10000,
    }),
    credits: z.number().int().positive("Credits must be greater than 0").openapi({
      description: "Number of generation credits granted upon capture",
      example: 100,
    }),
    packName: z.string().optional().openapi({
      description: "Optional name of credit recharge pack",
      example: "Creator Pro Pack",
    }),
    notes: z.record(z.string()).optional().openapi({
      description: "Custom metadata attached to order",
    }),
  })
  .openapi("CreateOrderRequest");

export const CreateOrderResponseSchema = z
  .object({
    success: z.boolean().openapi({ example: true }),
    order: z
      .object({
        id: z.string().openapi({ example: "order_Q1234567890" }),
        amount: z.number().openapi({ example: 10000 }),
        currency: z.string().openapi({ example: "INR" }),
        receipt: z.string().optional(),
        credits: z.number().openapi({ example: 100 }),
      })
      .openapi("RazorpayOrderDetails"),
    keyId: z.string().openapi({ example: "rzp_live_TagLstv6ZcCmoD" }),
  })
  .openapi("CreateOrderResponse");

export const VerifyPaymentSchema = z
  .object({
    razorpayOrderId: z.string().min(1, "razorpayOrderId is required").openapi({
      description: "Razorpay Order ID",
      example: "order_Q1234567890",
    }),
    razorpayPaymentId: z.string().min(1, "razorpayPaymentId is required").openapi({
      description: "Razorpay Payment ID provided on payment success handler",
      example: "pay_Q1234567890",
    }),
    razorpaySignature: z.string().min(1, "razorpaySignature is required").openapi({
      description: "Razorpay HMAC-SHA256 signature for verification",
    }),
  })
  .openapi("VerifyPaymentRequest");

export const VerifyPaymentResponseSchema = z
  .object({
    success: z.boolean().openapi({ example: true }),
    message: z.string().openapi({ example: "Payment verified successfully" }),
    creditsAdded: z.number().openapi({ example: 100 }),
    newBalance: z.number().openapi({ example: 1100 }),
    payment: PaymentModel,
  })
  .openapi("VerifyPaymentResponse");

export const PaymentHistoryResponseSchema = z
  .object({
    success: z.boolean().openapi({ example: true }),
    payments: z.array(PaymentModel),
    total: z.number().openapi({ example: 5 }),
  })
  .openapi("PaymentHistoryResponse");

export type CreateOrderInput = z.infer<typeof CreateOrderSchema>;
export type VerifyPaymentInput = z.infer<typeof VerifyPaymentSchema>;

export const createOrderSchema = CreateOrderSchema;
export const verifyPaymentSchema = VerifyPaymentSchema;
