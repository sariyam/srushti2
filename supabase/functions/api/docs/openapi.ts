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
import { StudioConfigResponseSchema } from "../schemas/studio.schema";
import {
  BusinessCategoryListResponseSchema,
  BusinessCategoryResponseSchema,
  CreateBusinessCategorySchema,
  UpdateBusinessCategorySchema,
} from "../schemas/business.schema";
import {
  CatalogItemListResponseSchema,
  CatalogItemResponseSchema,
  CreateCatalogItemSchema,
  UpdateCatalogItemSchema,
  CatalogQuerySchema,
} from "../schemas/catalog.schema";
import {
  StudioPresetListResponseSchema,
  StudioPresetResponseSchema,
  CreateStudioPresetSchema,
  UpdateStudioPresetSchema,
  PresetQuerySchema,
  FaceListResponseSchema,
  FaceResponseSchema,
  CreateFaceSchema,
  UpdateFaceSchema,
  PoseListResponseSchema,
  PoseResponseSchema,
  CreatePoseSchema,
  UpdatePoseSchema,
  PresentationListResponseSchema,
  PresentationResponseSchema,
  CreatePresentationSchema,
  UpdatePresentationSchema,
  BackgroundListResponseSchema,
  BackgroundResponseSchema,
  CreateBackgroundSchema,
  UpdateBackgroundSchema,
} from "../schemas/preset.schema";
import {
  SystemSettingListResponseSchema,
  SystemSettingResponseSchema,
  UpdateSystemSettingSchema,
} from "../schemas/settings.schema";
import {
  GroupedLookupsResponseSchema,
  SystemLookupListResponseSchema,
  SystemLookupResponseSchema,
  CreateSystemLookupSchema,
  UpdateSystemLookupSchema,
} from "../schemas/lookup.schema";
import {
  GenderListResponseSchema,
  GenderResponseSchema,
  CreateGenderSchema,
  UpdateGenderSchema,
} from "../schemas/gender.schema";
import {
  WorkspaceListResponseSchema,
  WorkspaceResponseSchema,
  CreateWorkspaceSchema,
  UpdateWorkspaceSchema,
} from "../schemas/workspace.schema";
import {
  WearTypeListResponseSchema,
  WearTypeResponseSchema,
  CreateWearTypeSchema,
  UpdateWearTypeSchema,
} from "../schemas/wear_type.schema";
import {
  GenerateAiImageSchema,
  GenerateAiImageResponseSchema,
} from "../schemas/ai.schema";

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

  // ===========================================================================
  // Studio Public Configuration Route
  // ===========================================================================
  app.openapi(
    createRoute({
      method: "get",
      path: "/studio/config",
      tags: ["Studio Config"],
      summary: "Get Active Studio Configuration",
      description: "Retrieves active business categories, catalog items, studio presets, model faces with Supabase Storage CDN URLs, and system settings.",
      responses: {
        200: {
          description: "Studio configuration",
          content: { "application/json": { schema: StudioConfigResponseSchema } },
        },
      },
    }),
    (() => {}) as any
  );

  // ===========================================================================
  // AI Photoshoot Studio - Secure Generation Proxy Route
  // ===========================================================================
  app.openapi(
    createRoute({
      method: "post",
      path: "/ai/generate",
      tags: ["AI Photoshoot Studio"],
      summary: "Generate AI Photoshoot Image",
      description: "Generates an AI photoshoot image using server-side OpenAI gateway with 100% facial identity preservation. The model face reference is strictly used when presentationMode is 'model' or 'partial_face'.",
      security: [{ BearerAuth: [] }],
      request: {
        body: {
          content: { "application/json": { schema: GenerateAiImageSchema } },
        },
      },
      responses: {
        200: {
          description: "AI image generated successfully with credits deducted",
          content: { "application/json": { schema: GenerateAiImageResponseSchema } },
        },
        400: { description: "Bad Request / Invalid image or prompt", content: { "application/json": { schema: ErrorResponseSchema } } },
        402: { description: "Payment Required / Insufficient credits", content: { "application/json": { schema: ErrorResponseSchema } } },
        403: { description: "Unauthorized / Invalid token", content: { "application/json": { schema: ErrorResponseSchema } } },
      },
    }),
    (() => {}) as any
  );

  // ===========================================================================
  // Admin: Business Categories
  // ===========================================================================
  app.openapi(
    createRoute({
      method: "get",
      path: "/admin/businesses",
      tags: ["Admin - Businesses"],
      summary: "List Business Categories",
      security: [{ BearerAuth: [] }],
      responses: {
        200: {
          description: "List of business categories",
          content: { "application/json": { schema: BusinessCategoryListResponseSchema } },
        },
        403: { description: "Admin role required", content: { "application/json": { schema: ErrorResponseSchema } } },
      },
    }),
    (() => {}) as any
  );

  app.openapi(
    createRoute({
      method: "post",
      path: "/admin/businesses",
      tags: ["Admin - Businesses"],
      summary: "Create Business Category",
      security: [{ BearerAuth: [] }],
      request: {
        body: { content: { "application/json": { schema: CreateBusinessCategorySchema } } },
      },
      responses: {
        201: {
          description: "Created category",
          content: { "application/json": { schema: BusinessCategoryResponseSchema } },
        },
        403: { description: "Admin role required", content: { "application/json": { schema: ErrorResponseSchema } } },
      },
    }),
    (() => {}) as any
  );

  // ===========================================================================
  // Admin: Catalog Items
  // ===========================================================================
  app.openapi(
    createRoute({
      method: "get",
      path: "/admin/catalog",
      tags: ["Admin - Catalog"],
      summary: "List Catalog Items (Garments & Jewelry)",
      security: [{ BearerAuth: [] }],
      request: { query: CatalogQuerySchema },
      responses: {
        200: {
          description: "Filtered catalog items",
          content: { "application/json": { schema: CatalogItemListResponseSchema } },
        },
        403: { description: "Admin role required", content: { "application/json": { schema: ErrorResponseSchema } } },
      },
    }),
    (() => {}) as any
  );

  app.openapi(
    createRoute({
      method: "post",
      path: "/admin/catalog",
      tags: ["Admin - Catalog"],
      summary: "Create Catalog Item",
      security: [{ BearerAuth: [] }],
      request: {
        body: { content: { "application/json": { schema: CreateCatalogItemSchema } } },
      },
      responses: {
        201: {
          description: "Created catalog item",
          content: { "application/json": { schema: CatalogItemResponseSchema } },
        },
        403: { description: "Admin role required", content: { "application/json": { schema: ErrorResponseSchema } } },
      },
    }),
    (() => {}) as any
  );

  // ===========================================================================
  // Admin: Studio Presets (Poses, Backgrounds, Faces)
  // ===========================================================================
  app.openapi(
    createRoute({
      method: "get",
      path: "/admin/presets",
      tags: ["Admin - Presets"],
      summary: "List Studio Presets",
      security: [{ BearerAuth: [] }],
      request: { query: PresetQuerySchema },
      responses: {
        200: {
          description: "List of studio presets",
          content: { "application/json": { schema: StudioPresetListResponseSchema } },
        },
        403: { description: "Admin role required", content: { "application/json": { schema: ErrorResponseSchema } } },
      },
    }),
    (() => {}) as any
  );

  app.openapi(
    createRoute({
      method: "post",
      path: "/admin/presets",
      tags: ["Admin - Presets"],
      summary: "Create Studio Preset",
      security: [{ BearerAuth: [] }],
      request: {
        body: { content: { "application/json": { schema: CreateStudioPresetSchema } } },
      },
      responses: {
        201: {
          description: "Created preset",
          content: { "application/json": { schema: StudioPresetResponseSchema } },
        },
        403: { description: "Admin role required", content: { "application/json": { schema: ErrorResponseSchema } } },
      },
    }),
    (() => {}) as any
  );

  // ===========================================================================
  // Studio: Public Config & Lookups
  // ===========================================================================
  app.openapi(
    createRoute({
      method: "get",
      path: "/studio/config",
      tags: ["Studio"],
      summary: "Get Complete Studio Configuration",
      description: "Returns active business categories, catalog items, presets (poses, backgrounds, faces), system lookups, and system settings.",
      responses: {
        200: {
          description: "Studio configuration",
          content: { "application/json": { schema: StudioConfigResponseSchema } },
        },
      },
    }),
    (() => {}) as any
  );

  app.openapi(
    createRoute({
      method: "get",
      path: "/studio/lookups",
      tags: ["Studio"],
      summary: "Get Grouped System Lookups",
      description: "Returns active system lookups grouped into backgroundTypes, genders, garmentCategories, and jewelryCategories.",
      responses: {
        200: {
          description: "Grouped lookups",
          content: { "application/json": { schema: GroupedLookupsResponseSchema } },
        },
      },
    }),
    (() => {}) as any
  );

  // ===========================================================================
  // Admin: System Settings
  // ===========================================================================
  app.openapi(
    createRoute({
      method: "get",
      path: "/admin/settings",
      tags: ["Admin - Settings"],
      summary: "Get All System Settings",
      security: [{ BearerAuth: [] }],
      responses: {
        200: {
          description: "List of system settings",
          content: { "application/json": { schema: SystemSettingListResponseSchema } },
        },
        403: { description: "Admin role required", content: { "application/json": { schema: ErrorResponseSchema } } },
      },
    }),
    (() => {}) as any
  );

  // ===========================================================================
  // Admin: System Lookups
  // ===========================================================================
  app.openapi(
    createRoute({
      method: "get",
      path: "/admin/lookups",
      tags: ["Admin - Lookups"],
      summary: "List All System Lookups",
      description: "Returns all system lookups (active and inactive) ordered by display order.",
      security: [{ BearerAuth: [] }],
      responses: {
        200: {
          description: "List of system lookups",
          content: { "application/json": { schema: SystemLookupListResponseSchema } },
        },
        403: { description: "Admin role required", content: { "application/json": { schema: ErrorResponseSchema } } },
      },
    }),
    (() => {}) as any
  );

  app.openapi(
    createRoute({
      method: "post",
      path: "/admin/lookups",
      tags: ["Admin - Lookups"],
      summary: "Create System Lookup",
      security: [{ BearerAuth: [] }],
      request: {
        body: { content: { "application/json": { schema: CreateSystemLookupSchema } } },
      },
      responses: {
        201: {
          description: "Created lookup",
          content: { "application/json": { schema: SystemLookupResponseSchema } },
        },
        403: { description: "Admin role required", content: { "application/json": { schema: ErrorResponseSchema } } },
      },
    }),
    (() => {}) as any
  );

  app.openapi(
    createRoute({
      method: "put",
      path: "/admin/lookups/{id}",
      tags: ["Admin - Lookups"],
      summary: "Update System Lookup",
      security: [{ BearerAuth: [] }],
      request: {
        params: z.object({ id: z.string().openapi({ example: "bg_indoor" }) }),
        body: { content: { "application/json": { schema: UpdateSystemLookupSchema } } },
      },
      responses: {
        200: {
          description: "Updated lookup",
          content: { "application/json": { schema: SystemLookupResponseSchema } },
        },
        403: { description: "Admin role required", content: { "application/json": { schema: ErrorResponseSchema } } },
      },
    }),
    (() => {}) as any
  );

  app.openapi(
    createRoute({
      method: "delete",
      path: "/admin/lookups/{id}",
      tags: ["Admin - Lookups"],
      summary: "Delete System Lookup",
      security: [{ BearerAuth: [] }],
      request: {
        params: z.object({ id: z.string().openapi({ example: "bg_indoor" }) }),
      },
      responses: {
        200: {
          description: "Lookup deleted successfully",
          content: {
            "application/json": {
              schema: z.object({ success: z.boolean(), message: z.string() }),
            },
          },
        },
        403: { description: "Admin role required", content: { "application/json": { schema: ErrorResponseSchema } } },
      },
    }),
    (() => {}) as any
  );

  // =============================================================================
  // Gender Demographics (Lookup Table & FK Source)
  // =============================================================================
  app.openapi(
    createRoute({
      method: "get",
      path: "/studio/genders",
      tags: ["Studio - Genders"],
      summary: "List Active Genders",
      description: "Returns active demographic gender lookups (female, male, unisex, all) referenced across catalog items, categories, presets, and users.",
      responses: {
        200: {
          description: "Active genders retrieved successfully",
          content: { "application/json": { schema: GenderListResponseSchema } },
        },
      },
    }),
    (() => {}) as any
  );

  app.openapi(
    createRoute({
      method: "get",
      path: "/admin/genders",
      tags: ["Admin - Genders"],
      summary: "List All Genders (Admin)",
      security: [{ BearerAuth: [] }],
      request: {
        query: z.object({
          isActive: z.string().optional().openapi({ example: "true" }),
        }),
      },
      responses: {
        200: {
          description: "All genders list",
          content: { "application/json": { schema: GenderListResponseSchema } },
        },
        403: { description: "Admin role required", content: { "application/json": { schema: ErrorResponseSchema } } },
      },
    }),
    (() => {}) as any
  );

  app.openapi(
    createRoute({
      method: "post",
      path: "/admin/genders",
      tags: ["Admin - Genders"],
      summary: "Create Gender Lookup",
      security: [{ BearerAuth: [] }],
      request: {
        body: {
          content: { "application/json": { schema: CreateGenderSchema } },
        },
      },
      responses: {
        201: {
          description: "Gender created successfully",
          content: { "application/json": { schema: GenderResponseSchema } },
        },
        400: { description: "Validation error", content: { "application/json": { schema: ErrorResponseSchema } } },
        403: { description: "Admin role required", content: { "application/json": { schema: ErrorResponseSchema } } },
      },
    }),
    (() => {}) as any
  );

  app.openapi(
    createRoute({
      method: "put",
      path: "/admin/genders/{id}",
      tags: ["Admin - Genders"],
      summary: "Update Gender Lookup",
      security: [{ BearerAuth: [] }],
      request: {
        params: z.object({ id: z.string().openapi({ example: "female" }) }),
        body: {
          content: { "application/json": { schema: UpdateGenderSchema } },
        },
      },
      responses: {
        200: {
          description: "Gender updated successfully",
          content: { "application/json": { schema: GenderResponseSchema } },
        },
        404: { description: "Gender not found", content: { "application/json": { schema: ErrorResponseSchema } } },
        403: { description: "Admin role required", content: { "application/json": { schema: ErrorResponseSchema } } },
      },
    }),
    (() => {}) as any
  );

  app.openapi(
    createRoute({
      method: "delete",
      path: "/admin/genders/{id}",
      tags: ["Admin - Genders"],
      summary: "Delete / Deactivate Gender Lookup",
      security: [{ BearerAuth: [] }],
      request: {
        params: z.object({ id: z.string().openapi({ example: "female" }) }),
      },
      responses: {
        200: {
          description: "Gender deleted or deactivated",
          content: {
            "application/json": {
              schema: z.object({ success: z.boolean(), message: z.string() }),
            },
          },
        },
        403: { description: "Admin role required", content: { "application/json": { schema: ErrorResponseSchema } } },
      },
    }),
    (() => {}) as any
  );

  // 17. Workspaces Lookup Routes
  app.openapi(
    createRoute({
      method: "get",
      path: "/studio/workspaces",
      tags: ["Studio - Workspaces"],
      summary: "List Active Workspaces",
      description: "Returns active studio workspaces (garment, jewelry, general, all, face) referenced as foreign keys by business_categories and catalog_items.",
      responses: {
        200: {
          description: "Active workspaces retrieved successfully",
          content: { "application/json": { schema: WorkspaceListResponseSchema } },
        },
      },
    }),
    (() => {}) as any
  );

  app.openapi(
    createRoute({
      method: "get",
      path: "/admin/workspaces",
      tags: ["Admin - Workspaces"],
      summary: "List All Workspaces (Admin)",
      security: [{ BearerAuth: [] }],
      request: {
        query: z.object({
          isActive: z.string().optional().openapi({ example: "true" }),
        }),
      },
      responses: {
        200: {
          description: "All workspaces list",
          content: { "application/json": { schema: WorkspaceListResponseSchema } },
        },
        403: { description: "Admin role required", content: { "application/json": { schema: ErrorResponseSchema } } },
      },
    }),
    (() => {}) as any
  );

  app.openapi(
    createRoute({
      method: "post",
      path: "/admin/workspaces",
      tags: ["Admin - Workspaces"],
      summary: "Create Workspace Lookup",
      security: [{ BearerAuth: [] }],
      request: {
        body: {
          content: { "application/json": { schema: CreateWorkspaceSchema } },
        },
      },
      responses: {
        201: {
          description: "Workspace created successfully",
          content: { "application/json": { schema: WorkspaceResponseSchema } },
        },
        400: { description: "Validation error", content: { "application/json": { schema: ErrorResponseSchema } } },
        403: { description: "Admin role required", content: { "application/json": { schema: ErrorResponseSchema } } },
      },
    }),
    (() => {}) as any
  );

  app.openapi(
    createRoute({
      method: "put",
      path: "/admin/workspaces/{id}",
      tags: ["Admin - Workspaces"],
      summary: "Update Workspace Lookup",
      security: [{ BearerAuth: [] }],
      request: {
        params: z.object({ id: z.string().openapi({ example: "garment" }) }),
        body: {
          content: { "application/json": { schema: UpdateWorkspaceSchema } },
        },
      },
      responses: {
        200: {
          description: "Workspace updated successfully",
          content: { "application/json": { schema: WorkspaceResponseSchema } },
        },
        400: { description: "Validation error", content: { "application/json": { schema: ErrorResponseSchema } } },
        404: { description: "Workspace not found", content: { "application/json": { schema: ErrorResponseSchema } } },
        403: { description: "Admin role required", content: { "application/json": { schema: ErrorResponseSchema } } },
      },
    }),
    (() => {}) as any
  );

  app.openapi(
    createRoute({
      method: "delete",
      path: "/admin/workspaces/{id}",
      tags: ["Admin - Workspaces"],
      summary: "Delete / Deactivate Workspace Lookup",
      security: [{ BearerAuth: [] }],
      request: {
        params: z.object({ id: z.string().openapi({ example: "garment" }) }),
      },
      responses: {
        200: {
          description: "Workspace deleted or deactivated",
          content: {
            "application/json": {
              schema: z.object({ success: z.boolean(), message: z.string() }),
            },
          },
        },
        403: { description: "Admin role required", content: { "application/json": { schema: ErrorResponseSchema } } },
      },
    }),
    (() => {}) as any
  );

  // 18. Wear Types Lookup Routes
  app.openapi(
    createRoute({
      method: "get",
      path: "/studio/wear-types",
      tags: ["Studio - Wear Types"],
      summary: "List Active Wear Types",
      description: "Returns active wear types (top_wear, bottom_wear, full_wear, neck_wear, ear_wear, wrist_wear, etc.) referenced as foreign keys by catalog_items and studio_presets.",
      request: {
        query: z.object({
          workspace: z.string().optional().openapi({ example: "garment" }),
        }),
      },
      responses: {
        200: {
          description: "Active wear types retrieved successfully",
          content: { "application/json": { schema: WearTypeListResponseSchema } },
        },
      },
    }),
    (() => {}) as any
  );

  app.openapi(
    createRoute({
      method: "get",
      path: "/admin/wear-types",
      tags: ["Admin - Wear Types"],
      summary: "List All Wear Types (Admin)",
      security: [{ BearerAuth: [] }],
      request: {
        query: z.object({
          workspace: z.string().optional().openapi({ example: "garment" }),
          isActive: z.string().optional().openapi({ example: "true" }),
        }),
      },
      responses: {
        200: {
          description: "All wear types list",
          content: { "application/json": { schema: WearTypeListResponseSchema } },
        },
        403: { description: "Admin role required", content: { "application/json": { schema: ErrorResponseSchema } } },
      },
    }),
    (() => {}) as any
  );

  app.openapi(
    createRoute({
      method: "post",
      path: "/admin/wear-types",
      tags: ["Admin - Wear Types"],
      summary: "Create Wear Type Lookup",
      security: [{ BearerAuth: [] }],
      request: {
        body: {
          content: { "application/json": { schema: CreateWearTypeSchema } },
        },
      },
      responses: {
        201: {
          description: "Wear type created successfully",
          content: { "application/json": { schema: WearTypeResponseSchema } },
        },
        400: { description: "Validation error", content: { "application/json": { schema: ErrorResponseSchema } } },
        403: { description: "Admin role required", content: { "application/json": { schema: ErrorResponseSchema } } },
      },
    }),
    (() => {}) as any
  );

  app.openapi(
    createRoute({
      method: "put",
      path: "/admin/wear-types/{id}",
      tags: ["Admin - Wear Types"],
      summary: "Update Wear Type Lookup",
      security: [{ BearerAuth: [] }],
      request: {
        params: z.object({ id: z.string().openapi({ example: "top_wear" }) }),
        body: {
          content: { "application/json": { schema: UpdateWearTypeSchema } },
        },
      },
      responses: {
        200: {
          description: "Wear type updated successfully",
          content: { "application/json": { schema: WearTypeResponseSchema } },
        },
        400: { description: "Validation error", content: { "application/json": { schema: ErrorResponseSchema } } },
        404: { description: "Wear type not found", content: { "application/json": { schema: ErrorResponseSchema } } },
        403: { description: "Admin role required", content: { "application/json": { schema: ErrorResponseSchema } } },
      },
    }),
    (() => {}) as any
  );

  app.openapi(
    createRoute({
      method: "delete",
      path: "/admin/wear-types/{id}",
      tags: ["Admin - Wear Types"],
      summary: "Delete / Deactivate Wear Type Lookup",
      security: [{ BearerAuth: [] }],
      request: {
        params: z.object({ id: z.string().openapi({ example: "top_wear" }) }),
      },
      responses: {
        200: {
          description: "Wear type deleted or deactivated",
          content: {
            "application/json": {
              schema: z.object({ success: z.boolean(), message: z.string() }),
            },
          },
        },
        403: { description: "Admin role required", content: { "application/json": { schema: ErrorResponseSchema } } },
      },
    }),
    (() => {}) as any
  );

  // =============================================================================
  // Admin - Studio Presets (Unified)
  // =============================================================================
  app.openapi(
    createRoute({
      method: "get",
      path: "/admin/presets",
      tags: ["Admin - Studio Presets"],
      summary: "List Studio Presets (Unified)",
      security: [{ BearerAuth: [] }],
      request: {
        query: PresetQuerySchema,
      },
      responses: {
        200: {
          description: "Presets list retrieved successfully",
          content: { "application/json": { schema: StudioPresetListResponseSchema } },
        },
        403: { description: "Admin role required", content: { "application/json": { schema: ErrorResponseSchema } } },
      },
    }),
    (() => {}) as any
  );

  app.openapi(
    createRoute({
      method: "post",
      path: "/admin/presets",
      tags: ["Admin - Studio Presets"],
      summary: "Create Studio Preset",
      security: [{ BearerAuth: [] }],
      request: {
        body: {
          content: { "application/json": { schema: CreateStudioPresetSchema } },
        },
      },
      responses: {
        201: {
          description: "Preset created successfully",
          content: { "application/json": { schema: StudioPresetResponseSchema } },
        },
        400: { description: "Validation error", content: { "application/json": { schema: ErrorResponseSchema } } },
        403: { description: "Admin role required", content: { "application/json": { schema: ErrorResponseSchema } } },
      },
    }),
    (() => {}) as any
  );

  // =============================================================================
  // Admin - Faces
  // =============================================================================
  app.openapi(
    createRoute({
      method: "get",
      path: "/admin/faces",
      tags: ["Admin - Faces"],
      summary: "List Model Faces",
      security: [{ BearerAuth: [] }],
      request: {
        query: z.object({
          workspace: z.enum(["garment", "jewelry", "all"]).optional(),
          genderTarget: z.string().optional(),
          wearTypeId: z.string().optional(),
          isActive: z.string().optional(),
        }),
      },
      responses: {
        200: {
          description: "Faces list retrieved successfully",
          content: { "application/json": { schema: FaceListResponseSchema } },
        },
        403: { description: "Admin role required", content: { "application/json": { schema: ErrorResponseSchema } } },
      },
    }),
    (() => {}) as any
  );

  app.openapi(
    createRoute({
      method: "post",
      path: "/admin/faces",
      tags: ["Admin - Faces"],
      summary: "Create Model Face",
      security: [{ BearerAuth: [] }],
      request: {
        body: {
          content: { "application/json": { schema: CreateFaceSchema } },
        },
      },
      responses: {
        201: {
          description: "Face created successfully",
          content: { "application/json": { schema: FaceResponseSchema } },
        },
        400: { description: "Validation error", content: { "application/json": { schema: ErrorResponseSchema } } },
        403: { description: "Admin role required", content: { "application/json": { schema: ErrorResponseSchema } } },
      },
    }),
    (() => {}) as any
  );

  // =============================================================================
  // Admin - Poses
  // =============================================================================
  app.openapi(
    createRoute({
      method: "get",
      path: "/admin/poses",
      tags: ["Admin - Poses"],
      summary: "List Model Poses",
      security: [{ BearerAuth: [] }],
      request: {
        query: z.object({
          workspace: z.enum(["garment", "jewelry", "all"]).optional(),
          genderTarget: z.string().optional(),
          wearTypeId: z.string().optional(),
          isActive: z.string().optional(),
        }),
      },
      responses: {
        200: {
          description: "Poses list retrieved successfully",
          content: { "application/json": { schema: PoseListResponseSchema } },
        },
        403: { description: "Admin role required", content: { "application/json": { schema: ErrorResponseSchema } } },
      },
    }),
    (() => {}) as any
  );

  app.openapi(
    createRoute({
      method: "post",
      path: "/admin/poses",
      tags: ["Admin - Poses"],
      summary: "Create Model Pose",
      security: [{ BearerAuth: [] }],
      request: {
        body: {
          content: { "application/json": { schema: CreatePoseSchema } },
        },
      },
      responses: {
        201: {
          description: "Pose created successfully",
          content: { "application/json": { schema: PoseResponseSchema } },
        },
        400: { description: "Validation error", content: { "application/json": { schema: ErrorResponseSchema } } },
        403: { description: "Admin role required", content: { "application/json": { schema: ErrorResponseSchema } } },
      },
    }),
    (() => {}) as any
  );

  // =============================================================================
  // Admin - Presentations
  // =============================================================================
  app.openapi(
    createRoute({
      method: "get",
      path: "/admin/presentations",
      tags: ["Admin - Presentations"],
      summary: "List Presentation Modes",
      security: [{ BearerAuth: [] }],
      request: {
        query: z.object({
          workspace: z.enum(["garment", "jewelry", "all"]).optional(),
          genderTarget: z.string().optional(),
          wearTypeId: z.string().optional(),
          isActive: z.string().optional(),
        }),
      },
      responses: {
        200: {
          description: "Presentations list retrieved successfully",
          content: { "application/json": { schema: PresentationListResponseSchema } },
        },
        403: { description: "Admin role required", content: { "application/json": { schema: ErrorResponseSchema } } },
      },
    }),
    (() => {}) as any
  );

  app.openapi(
    createRoute({
      method: "post",
      path: "/admin/presentations",
      tags: ["Admin - Presentations"],
      summary: "Create Presentation Mode",
      security: [{ BearerAuth: [] }],
      request: {
        body: {
          content: { "application/json": { schema: CreatePresentationSchema } },
        },
      },
      responses: {
        201: {
          description: "Presentation created successfully",
          content: { "application/json": { schema: PresentationResponseSchema } },
        },
        400: { description: "Validation error", content: { "application/json": { schema: ErrorResponseSchema } } },
        403: { description: "Admin role required", content: { "application/json": { schema: ErrorResponseSchema } } },
      },
    }),
    (() => {}) as any
  );

  // =============================================================================
  // Admin - Backgrounds
  // =============================================================================
  app.openapi(
    createRoute({
      method: "get",
      path: "/admin/backgrounds",
      tags: ["Admin - Backgrounds"],
      summary: "List Background Presets",
      security: [{ BearerAuth: [] }],
      request: {
        query: z.object({
          workspace: z.enum(["garment", "jewelry", "all"]).optional(),
          genderTarget: z.string().optional(),
          wearTypeId: z.string().optional(),
          isActive: z.string().optional(),
        }),
      },
      responses: {
        200: {
          description: "Backgrounds list retrieved successfully",
          content: { "application/json": { schema: BackgroundListResponseSchema } },
        },
        403: { description: "Admin role required", content: { "application/json": { schema: ErrorResponseSchema } } },
      },
    }),
    (() => {}) as any
  );

  app.openapi(
    createRoute({
      method: "post",
      path: "/admin/backgrounds",
      tags: ["Admin - Backgrounds"],
      summary: "Create Background Preset",
      security: [{ BearerAuth: [] }],
      request: {
        body: {
          content: { "application/json": { schema: CreateBackgroundSchema } },
        },
      },
      responses: {
        201: {
          description: "Background created successfully",
          content: { "application/json": { schema: BackgroundResponseSchema } },
        },
        400: { description: "Validation error", content: { "application/json": { schema: ErrorResponseSchema } } },
        403: { description: "Admin role required", content: { "application/json": { schema: ErrorResponseSchema } } },
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
