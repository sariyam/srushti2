import { OpenAPIHono, createRoute, z } from "@hono/zod-openapi";
import {
  SendOtpSchema,
  SendOtpResponseSchema,
  VerifyOtpSchema,
  VerifyOtpResponseSchema,
  RefreshTokenSchema,
  RefreshTokenResponseSchema,
  UserMeResponseSchema,
} from "../schemas/auth.schema";
import {
  CreateOrderSchema,
  CreateOrderResponseSchema,
  VerifyPaymentSchema,
  VerifyPaymentResponseSchema,
  PaymentHistoryResponseSchema,
} from "../schemas/payment.schema";
import {
  RecordUsageSchema,
  RecordUsageResponseSchema,
  UserBalanceResponseSchema,
  UsageHistoryResponseSchema,
} from "../schemas/usage.schema";
import {
  AdjustCreditsSchema,
  AdjustCreditsResponseSchema,
  AdminUserListResponseSchema,
  AdminAnalyticsResponseSchema,
} from "../schemas/admin.schema";
import {
  PaginationQuerySchema,
} from "../schemas/common.schema";
import {
  ErrorResponseSchema,
  HealthStatusSchema,
} from "../models/response.model";

export function createOpenApiApp(): OpenAPIHono {
  const app = new OpenAPIHono();

  // Define Bearer Auth Security Scheme
  app.openAPIRegistry.registerComponent("securitySchemes", "BearerAuth", {
    type: "http",
    scheme: "bearer",
    bearerFormat: "JWT",
    description: "Enter your JWT token obtained from /auth/otp/verify",
  });

  // 1. Health Route
  app.openapi(
    createRoute({
      method: "get",
      path: "/health",
      tags: ["Health"],
      summary: "System Health & DB Connectivity",
      description: "Checks API status, runtime uptime, and active connection to Supabase PostgreSQL.",
      responses: {
        200: {
          description: "System is healthy",
          content: { "application/json": { schema: HealthStatusSchema } },
        },
        503: {
          description: "Database is unreachable or degraded",
          content: { "application/json": { schema: HealthStatusSchema } },
        },
      },
    }),
    (() => {}) as any
  );

  // 2. Auth Routes
  app.openapi(
    createRoute({
      method: "post",
      path: "/auth/otp/send",
      tags: ["Auth"],
      summary: "Send 6-digit OTP",
      description: "Generates a 6-digit OTP and dispatches it via SMS/email.",
      request: {
        body: {
          content: { "application/json": { schema: SendOtpSchema } },
        },
      },
      responses: {
        200: {
          description: "OTP dispatched successfully",
          content: { "application/json": { schema: SendOtpResponseSchema } },
        },
        400: {
          description: "Validation error",
          content: { "application/json": { schema: ErrorResponseSchema } },
        },
      },
    }),
    (() => {}) as any
  );

  app.openapi(
    createRoute({
      method: "post",
      path: "/auth/otp/verify",
      tags: ["Auth"],
      summary: "Verify OTP & Issue JWT",
      description: "Validates the OTP code, logs in or auto-registers the user, and returns access & refresh tokens.",
      request: {
        body: {
          content: { "application/json": { schema: VerifyOtpSchema } },
        },
      },
      responses: {
        200: {
          description: "Authentication successful",
          content: { "application/json": { schema: VerifyOtpResponseSchema } },
        },
        400: {
          description: "Invalid or expired OTP",
          content: { "application/json": { schema: ErrorResponseSchema } },
        },
      },
    }),
    (() => {}) as any
  );

  app.openapi(
    createRoute({
      method: "post",
      path: "/auth/refresh",
      tags: ["Auth"],
      summary: "Refresh JWT Session",
      description: "Issues a new JWT access token using a valid refresh token.",
      request: {
        body: {
          content: { "application/json": { schema: RefreshTokenSchema } },
        },
      },
      responses: {
        200: {
          description: "Tokens renewed successfully",
          content: { "application/json": { schema: RefreshTokenResponseSchema } },
        },
        401: {
          description: "Expired or invalid refresh token",
          content: { "application/json": { schema: ErrorResponseSchema } },
        },
      },
    }),
    (() => {}) as any
  );

  app.openapi(
    createRoute({
      method: "get",
      path: "/auth/me",
      tags: ["Auth"],
      summary: "Get Current Authenticated User",
      description: "Returns profile and current wallet balance for the authenticated user.",
      security: [{ BearerAuth: [] }],
      responses: {
        200: {
          description: "User profile details",
          content: { "application/json": { schema: UserMeResponseSchema } },
        },
        401: {
          description: "Unauthorized",
          content: { "application/json": { schema: ErrorResponseSchema } },
        },
      },
    }),
    (() => {}) as any
  );

  // 3. Payment Routes
  app.openapi(
    createRoute({
      method: "post",
      path: "/payments/order",
      tags: ["Payments"],
      summary: "Create Razorpay Recharge Order",
      description: "Initializes a Razorpay payment order to buy AI generation credits.",
      security: [{ BearerAuth: [] }],
      request: {
        body: {
          content: { "application/json": { schema: CreateOrderSchema } },
        },
      },
      responses: {
        200: {
          description: "Order created successfully",
          content: { "application/json": { schema: CreateOrderResponseSchema } },
        },
        401: {
          description: "Unauthorized",
          content: { "application/json": { schema: ErrorResponseSchema } },
        },
      },
    }),
    (() => {}) as any
  );

  app.openapi(
    createRoute({
      method: "post",
      path: "/payments/verify",
      tags: ["Payments"],
      summary: "Verify Razorpay Payment Signature",
      description: "Validates HMAC-SHA256 signature and credits user wallet.",
      security: [{ BearerAuth: [] }],
      request: {
        body: {
          content: { "application/json": { schema: VerifyPaymentSchema } },
        },
      },
      responses: {
        200: {
          description: "Payment captured & credits added",
          content: { "application/json": { schema: VerifyPaymentResponseSchema } },
        },
        400: {
          description: "Invalid payment signature",
          content: { "application/json": { schema: ErrorResponseSchema } },
        },
      },
    }),
    (() => {}) as any
  );

  app.openapi(
    createRoute({
      method: "get",
      path: "/payments/history",
      tags: ["Payments"],
      summary: "Get Payment Transaction History",
      description: "Returns past transactions and recharge history for the user.",
      security: [{ BearerAuth: [] }],
      request: {
        query: PaginationQuerySchema,
      },
      responses: {
        200: {
          description: "Payment history list",
          content: { "application/json": { schema: PaymentHistoryResponseSchema } },
        },
      },
    }),
    (() => {}) as any
  );

  // 4. Usage Routes
  app.openapi(
    createRoute({
      method: "post",
      path: "/usage/record",
      tags: ["Usage"],
      summary: "Record AI Generation Usage",
      description: "Logs an AI generation task (garment, jewelry, face, etc.) and deducts wallet credits.",
      security: [{ BearerAuth: [] }],
      request: {
        body: {
          content: { "application/json": { schema: RecordUsageSchema } },
        },
      },
      responses: {
        200: {
          description: "Usage recorded and credit deducted",
          content: { "application/json": { schema: RecordUsageResponseSchema } },
        },
        402: {
          description: "Insufficient wallet balance",
          content: { "application/json": { schema: ErrorResponseSchema } },
        },
      },
    }),
    (() => {}) as any
  );

  app.openapi(
    createRoute({
      method: "get",
      path: "/usage/balance",
      tags: ["Usage"],
      summary: "Get Current Wallet Credit Balance",
      security: [{ BearerAuth: [] }],
      responses: {
        200: {
          description: "User credit balance",
          content: { "application/json": { schema: UserBalanceResponseSchema } },
        },
      },
    }),
    (() => {}) as any
  );

  app.openapi(
    createRoute({
      method: "get",
      path: "/usage/history",
      tags: ["Usage"],
      summary: "Get Generation Usage History",
      security: [{ BearerAuth: [] }],
      request: {
        query: PaginationQuerySchema,
      },
      responses: {
        200: {
          description: "Generation usage history list",
          content: { "application/json": { schema: UsageHistoryResponseSchema } },
        },
      },
    }),
    (() => {}) as any
  );

  // 5. Admin Routes
  app.openapi(
    createRoute({
      method: "get",
      path: "/admin/users",
      tags: ["Admin"],
      summary: "List All Users (Admin Only)",
      security: [{ BearerAuth: [] }],
      request: {
        query: PaginationQuerySchema,
      },
      responses: {
        200: {
          description: "Users list",
          content: { "application/json": { schema: AdminUserListResponseSchema } },
        },
        403: {
          description: "Admin or SuperAdmin role required",
          content: { "application/json": { schema: ErrorResponseSchema } },
        },
      },
    }),
    (() => {}) as any
  );

  app.openapi(
    createRoute({
      method: "post",
      path: "/admin/credits/adjust",
      tags: ["Admin"],
      summary: "Manually Adjust User Credits (Admin Only)",
      security: [{ BearerAuth: [] }],
      request: {
        body: {
          content: { "application/json": { schema: AdjustCreditsSchema } },
        },
      },
      responses: {
        200: {
          description: "Credits adjusted successfully",
          content: { "application/json": { schema: AdjustCreditsResponseSchema } },
        },
        403: {
          description: "Forbidden",
          content: { "application/json": { schema: ErrorResponseSchema } },
        },
      },
    }),
    (() => {}) as any
  );

  app.openapi(
    createRoute({
      method: "get",
      path: "/admin/analytics",
      tags: ["Admin"],
      summary: "Platform Analytics Summary (Admin Only)",
      security: [{ BearerAuth: [] }],
      responses: {
        200: {
          description: "Analytics summary",
          content: { "application/json": { schema: AdminAnalyticsResponseSchema } },
        },
      },
    }),
    (() => {}) as any
  );

  return app;
}

let cachedSpec: any = null;

export function getOpenApiDocument(serverUrl?: string): any {
  if (!cachedSpec) {
    const app = createOpenApiApp();
    cachedSpec = app.getOpenAPI31Document({
      openapi: "3.1.0",
      info: {
        title: "Srushti AI API",
        version: "1.0.0",
        description:
          "Production-ready backend API for Srushti AI powered by Supabase PostgreSQL, Drizzle ORM, Express/Serverless Edge Runtime, Custom OTP Authentication, Razorpay Payments, and AI generation credit management.",
        contact: {
          name: "Srushti AI Support",
          url: "https://srushti.ai",
        },
      },
      servers: [
        {
          url: serverUrl || "/api",
          description: "Current API Base URL",
        },
        {
          url: "/functions/v1/api",
          description: "Supabase Edge Functions Gateway",
        },
        {
          url: "http://localhost:4002/api",
          description: "Local Development Server",
        },
      ],
    });
  }
  return cachedSpec;
}
