import { z } from "@hono/zod-openapi";

export const PaymentStatusEnum = z.enum(["created", "attempted", "paid", "failed"]).openapi({
  description: "Status of the payment transaction",
  example: "paid",
});

export const PaymentModel = z
  .object({
    id: z.string().uuid().openapi({
      description: "Unique payment record UUID",
      example: "a81d431c-3233-4f91-88c2-28df05374465",
    }),
    userId: z.string().uuid().openapi({
      description: "User UUID who initiated the recharge",
      example: "570b8a2a-e899-4d4f-9d2e-dbc0f4d21ae1",
    }),
    amount: z.number().int().openapi({
      description: "Payment amount in smallest currency unit (e.g. paise: 10000 = ₹100)",
      example: 10000,
    }),
    currency: z.string().openapi({
      description: "ISO 4217 Currency Code",
      example: "INR",
    }),
    credits: z.number().int().openapi({
      description: "Number of generation credits granted upon successful payment",
      example: 100,
    }),
    status: PaymentStatusEnum,
    razorpayOrderId: z.string().openapi({
      description: "Razorpay Order ID",
      example: "order_Q1234567890",
    }),
    razorpayPaymentId: z.string().nullable().optional().openapi({
      description: "Razorpay Payment ID assigned upon capture",
      example: "pay_Q1234567890",
    }),
    razorpaySignature: z.string().nullable().optional().openapi({
      description: "Cryptographic HMAC SHA256 signature from Razorpay",
    }),
    notes: z.record(z.any()).nullable().optional().openapi({
      description: "Custom metadata passed during order creation",
    }),
    createdAt: z.string().datetime().or(z.date()).openapi({
      description: "Order creation timestamp",
      example: "2026-09-18T10:00:00Z",
    }),
    updatedAt: z.string().datetime().or(z.date()).openapi({
      description: "Last status update timestamp",
      example: "2026-09-18T10:02:00Z",
    }),
  })
  .openapi("Payment");

export type Payment = z.infer<typeof PaymentModel>;
export type PaymentStatus = z.infer<typeof PaymentStatusEnum>;
