import { pgTable, uuid, text, integer, boolean, timestamp, jsonb, index, unique, foreignKey, primaryKey } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// 1. Users Table (Strictly 2 roles: 'user' and 'admin')
export const users = pgTable(
  "users",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    phone: text("phone").notNull().unique(),
    avatarUrl: text("avatar_url"),
    gender: text("gender").references(() => genders.id, { onDelete: "set null" }),
    role: text("role", { enum: ["user", "admin"] })
      .notNull()
      .default("user"),
    walletBalance: integer("wallet_balance").notNull().default(10), // default free credits
    isActive: boolean("is_active").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("users_phone_idx").on(table.phone),
    index("users_gender_idx").on(table.gender),
  ]
);

// 2. OTPs Table (Custom OTP Service)
export const otps = pgTable(
  "otps",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    identifier: text("identifier").notNull(), // Phone or email
    codeHash: text("code_hash").notNull(), // Bcrypt hashed OTP code
    purpose: text("purpose", { enum: ["login", "register", "recharge"] })
      .notNull()
      .default("login"),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    isUsed: boolean("is_used").notNull().default(false),
    attempts: integer("attempts").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("otps_identifier_idx").on(table.identifier),
    index("otps_expires_at_idx").on(table.expiresAt),
  ]
);

// 3. Payments Table (Razorpay Integration)
export const payments = pgTable(
  "payments",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    razorpayOrderId: text("razorpay_order_id").notNull().unique(),
    razorpayPaymentId: text("razorpay_payment_id"),
    razorpaySignature: text("razorpay_signature"),
    amount: integer("amount").notNull(), // in paise (e.g. 10000 = ₹100)
    currency: text("currency").notNull().default("INR"),
    status: text("status", { enum: ["created", "paid", "failed"] })
      .notNull()
      .default("created"),
    creditsAdded: integer("credits_added").notNull().default(0),
    metadata: jsonb("metadata").$type<{
      packName?: string;
      notes?: Record<string, any>;
      payerEmail?: string;
      payerContact?: string;
    }>(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("payments_user_id_idx").on(table.userId),
    index("payments_razorpay_order_id_idx").on(table.razorpayOrderId),
  ]
);

// 4. Usage Table (AI Photoshoot & Generation Tracking)
export const usage = pgTable(
  "usage",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    workspace: text("workspace")
      .notNull()
      .default("garment")
      .references(() => workspaces.id, { onDelete: "restrict" }),
    itemType: text("item_type").notNull(), // e.g. 'saree', 'lehenga', 'necklace', etc.
    creditsDeducted: integer("credits_deducted").notNull().default(1),
    prompt: text("prompt"),
    status: text("status", { enum: ["pending", "success", "failed"] })
      .notNull()
      .default("pending"),
    errorMessage: text("error_message"),
    latencyMs: integer("latency_ms"),
    genderTarget: text("gender_target").references(() => genders.id, { onDelete: "set null" }),
    metadata: jsonb("metadata").$type<{
      aspectRatio?: string;
      resolution?: string;
      photoStyle?: string;
      lighting?: string;
      background?: string;
      modelDetails?: Record<string, any>;
    }>(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("usage_user_id_idx").on(table.userId),
    index("usage_workspace_idx").on(table.workspace),
    index("usage_created_at_idx").on(table.createdAt),
    index("usage_gender_target_idx").on(table.genderTarget),
  ]
);

// 5. Genders Lookup Table (female, male, unisex, all)
export const genders = pgTable(
  "genders",
  {
    id: text("id").primaryKey(), // 'female', 'male', 'unisex', 'all'
    code: text("code").notNull().unique(),
    nameEn: text("name_en").notNull(),
    nameTe: text("name_te").notNull(),
    description: text("description"),
    icon: text("icon"),
    displayOrder: integer("display_order").notNull().default(0),
    isActive: boolean("is_active").notNull().default(true),
    metadata: jsonb("metadata").$type<Record<string, any>>().default({}),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("genders_code_idx").on(table.code),
    index("genders_is_active_idx").on(table.isActive),
  ]
);

// 6. Workspaces Lookup Table ('garment', 'jewelry', 'general', 'all', 'face')
export const workspaces = pgTable(
  "workspaces",
  {
    id: text("id").primaryKey(), // 'garment', 'jewelry', 'general', 'all', 'face'
    code: text("code").notNull().unique(),
    nameEn: text("name_en").notNull(),
    nameTe: text("name_te").notNull(),
    description: text("description"),
    icon: text("icon"),
    displayOrder: integer("display_order").notNull().default(0),
    isActive: boolean("is_active").notNull().default(true),
    metadata: jsonb("metadata").$type<Record<string, any>>().default({}),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("workspaces_code_idx").on(table.code),
    index("workspaces_is_active_idx").on(table.isActive),
  ]
);

// 7. Business Categories Table (Verticals & Collections)
export const businessCategories = pgTable(
  "business_categories",
  {
    id: text("id").primaryKey(), // e.g. 'garment_female', 'garment_male', 'jewelry_female', 'jewelry_male'
    workspace: text("workspace")
      .notNull()
      .default("garment")
      .references(() => workspaces.id, { onDelete: "restrict" }),
    genderTarget: text("gender_target")
      .notNull()
      .default("all")
      .references(() => genders.id, { onDelete: "restrict" }),
    nameEn: text("name_en").notNull(),
    nameTe: text("name_te").notNull(),
    icon: text("icon"),
    bannerUrl: text("banner_url"),
    displayOrder: integer("display_order").notNull().default(0),
    isActive: boolean("is_active").notNull().default(true),
    metadata: jsonb("metadata").$type<Record<string, any>>().default({}),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("business_categories_workspace_idx").on(table.workspace),
    index("business_categories_gender_idx").on(table.genderTarget),
    unique("uq_business_categories_id_workspace").on(table.id, table.workspace),
  ]
);

// 7b. Wear Types Lookup Table ('top_wear', 'bottom_wear', 'full_wear', 'neck_wear', 'ear_wear', etc.)
export const wearTypes = pgTable(
  "wear_types",
  {
    id: text("id").primaryKey(), // 'top_wear', 'bottom_wear', 'full_wear', 'neck_wear', 'ear_wear', etc.
    workspace: text("workspace")
      .notNull()
      .references(() => workspaces.id, { onDelete: "restrict" }),
    code: text("code").notNull().unique(),
    nameEn: text("name_en").notNull(),
    nameTe: text("name_te").notNull(),
    description: text("description"),
    icon: text("icon"),
    displayOrder: integer("display_order").notNull().default(0),
    isActive: boolean("is_active").notNull().default(true),
    metadata: jsonb("metadata").$type<Record<string, any>>().default({}),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("wear_types_workspace_idx").on(table.workspace),
    index("wear_types_code_idx").on(table.code),
    index("wear_types_is_active_idx").on(table.isActive),
    unique("uq_wear_types_id_workspace").on(table.id, table.workspace),
  ]
);

// 8. Catalog Items Table (Garment & Jewelry styles with prompt directives)
export const catalogItems = pgTable(
  "catalog_items",
  {
    id: text("id").primaryKey(), // e.g. 'saree', 'kurta', 'necklace'
    businessCategoryId: text("business_category_id").references(() => businessCategories.id, { onDelete: "set null" }),
    wearType: text("wear_type")
      .notNull()
      .references(() => wearTypes.id, { onDelete: "restrict" }),
    workspace: text("workspace")
      .notNull()
      .default("garment")
      .references(() => workspaces.id, { onDelete: "restrict" }),
    genderTarget: text("gender_target")
      .notNull()
      .default("unisex")
      .references(() => genders.id, { onDelete: "restrict" }),
    nameEn: text("name_en").notNull(),
    nameTe: text("name_te").notNull(),
    promptDirective: text("prompt_directive").notNull(),
    placementDirective: text("placement_directive"),
    icon: text("icon"),
    sampleImageUrl: text("sample_image_url"),
    displayOrder: integer("display_order").notNull().default(0),
    isActive: boolean("is_active").notNull().default(true),
    metadata: jsonb("metadata").$type<Record<string, any>>().default({}),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("catalog_items_workspace_idx").on(table.workspace),
    index("catalog_items_gender_idx").on(table.genderTarget),
    index("catalog_items_wear_type_idx").on(table.wearType),
    index("catalog_items_is_active_idx").on(table.isActive),
    foreignKey({
      columns: [table.businessCategoryId, table.workspace],
      foreignColumns: [businessCategories.id, businessCategories.workspace],
      name: "fk_catalog_items_business_category_workspace",
    })
      .onDelete("restrict")
      .onUpdate("cascade"),
    foreignKey({
      columns: [table.wearType, table.workspace],
      foreignColumns: [wearTypes.id, wearTypes.workspace],
      name: "fk_catalog_items_wear_type_workspace",
    })
      .onDelete("restrict")
      .onUpdate("cascade"),
  ]
);

// 8b. Catalog Item Presentations Junction Table (Multiple presentation modes per catalog item)
export const catalogItemPresentations = pgTable(
  "catalog_item_presentations",
  {
    catalogItemId: text("catalog_item_id")
      .notNull()
      .references(() => catalogItems.id, { onDelete: "cascade", onUpdate: "cascade" }),
    presentationId: text("presentation_id")
      .notNull()
      .references(() => presentations.id, { onDelete: "cascade", onUpdate: "cascade" }),
    displayOrder: integer("display_order").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    primaryKey({ columns: [table.catalogItemId, table.presentationId] }),
    index("cat_item_pres_item_idx").on(table.catalogItemId),
    index("cat_item_pres_pres_idx").on(table.presentationId),
  ]
);

// 8c. Catalog Item Backgrounds Junction Table (Multiple backgrounds [indoor + outdoor] per catalog item)
export const catalogItemBackgrounds = pgTable(
  "catalog_item_backgrounds",
  {
    catalogItemId: text("catalog_item_id")
      .notNull()
      .references(() => catalogItems.id, { onDelete: "cascade", onUpdate: "cascade" }),
    backgroundId: text("background_id")
      .notNull()
      .references(() => backgrounds.id, { onDelete: "cascade", onUpdate: "cascade" }),
    displayOrder: integer("display_order").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    primaryKey({ columns: [table.catalogItemId, table.backgroundId] }),
    index("cat_item_bg_item_idx").on(table.catalogItemId),
    index("cat_item_bg_bg_idx").on(table.backgroundId),
  ]
);

// 8d. Catalog Item Poses Junction Table (Multiple poses per catalog item)
export const catalogItemPoses = pgTable(
  "catalog_item_poses",
  {
    catalogItemId: text("catalog_item_id")
      .notNull()
      .references(() => catalogItems.id, { onDelete: "cascade", onUpdate: "cascade" }),
    poseId: text("pose_id")
      .notNull()
      .references(() => poses.id, { onDelete: "cascade", onUpdate: "cascade" }),
    displayOrder: integer("display_order").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    primaryKey({ columns: [table.catalogItemId, table.poseId] }),
    index("cat_item_poses_item_idx").on(table.catalogItemId),
    index("cat_item_poses_pose_idx").on(table.poseId),
  ]
);

// 9a. Faces Table (Model Faces: Ananya, Priya, Arjun, etc.)
export const faces = pgTable(
  "faces",
  {
    id: text("id").primaryKey(),
    workspace: text("workspace")
      .notNull()
      .default("all")
      .references(() => workspaces.id, { onDelete: "restrict", onUpdate: "cascade" }),
    genderTarget: text("gender_target")
      .default("all")
      .references(() => genders.id, { onDelete: "set default", onUpdate: "cascade" }),
    wearTypeId: text("wear_type_id").references(() => wearTypes.id, { onDelete: "set null", onUpdate: "cascade" }),
    subCategory: text("sub_category"),
    nameEn: text("name_en").notNull(),
    nameTe: text("name_te").notNull(),
    promptDirective: text("prompt_directive").notNull(),
    cameraFraming: text("camera_framing"),
    faceVisibilityRule: text("face_visibility_rule"),
    thumbnailUrl: text("thumbnail_url"),
    previewImageUrl: text("preview_image_url"),
    storagePath: text("storage_path"),
    colorHex: text("color_hex"),
    displayOrder: integer("display_order").notNull().default(0),
    isActive: boolean("is_active").notNull().default(true),
    metadata: jsonb("metadata").$type<Record<string, any>>().default({}),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("faces_workspace_idx").on(table.workspace),
    index("faces_gender_target_idx").on(table.genderTarget),
    index("faces_wear_type_idx").on(table.wearTypeId),
    index("faces_sub_category_idx").on(table.subCategory),
    index("faces_is_active_idx").on(table.isActive),
  ]
);

// 9b. Poses Table (Full Wear, Top Wear, Jewelry Poses, Camera Angles)
export const poses = pgTable(
  "poses",
  {
    id: text("id").primaryKey(),
    workspace: text("workspace")
      .notNull()
      .default("all")
      .references(() => workspaces.id, { onDelete: "restrict", onUpdate: "cascade" }),
    genderTarget: text("gender_target")
      .default("all")
      .references(() => genders.id, { onDelete: "set default", onUpdate: "cascade" }),
    wearTypeId: text("wear_type_id").references(() => wearTypes.id, { onDelete: "set null", onUpdate: "cascade" }),
    subCategory: text("sub_category"),
    nameEn: text("name_en").notNull(),
    nameTe: text("name_te").notNull(),
    promptDirective: text("prompt_directive").notNull(),
    cameraFraming: text("camera_framing"),
    faceVisibilityRule: text("face_visibility_rule"),
    thumbnailUrl: text("thumbnail_url"),
    previewImageUrl: text("preview_image_url"),
    storagePath: text("storage_path"),
    colorHex: text("color_hex"),
    displayOrder: integer("display_order").notNull().default(0),
    isActive: boolean("is_active").notNull().default(true),
    metadata: jsonb("metadata").$type<Record<string, any>>().default({}),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("poses_workspace_idx").on(table.workspace),
    index("poses_gender_target_idx").on(table.genderTarget),
    index("poses_wear_type_idx").on(table.wearTypeId),
    index("poses_sub_category_idx").on(table.subCategory),
    index("poses_is_active_idx").on(table.isActive),
  ]
);

// 9c. Presentations Table (Model, Flatlay, Mannequin, Hanger, Partial Face)
export const presentations = pgTable(
  "presentations",
  {
    id: text("id").primaryKey(),
    workspace: text("workspace")
      .notNull()
      .default("all")
      .references(() => workspaces.id, { onDelete: "restrict", onUpdate: "cascade" }),
    genderTarget: text("gender_target")
      .default("all")
      .references(() => genders.id, { onDelete: "set default", onUpdate: "cascade" }),
    wearTypeId: text("wear_type_id").references(() => wearTypes.id, { onDelete: "set null", onUpdate: "cascade" }),
    subCategory: text("sub_category"),
    nameEn: text("name_en").notNull(),
    nameTe: text("name_te").notNull(),
    promptDirective: text("prompt_directive").notNull(),
    cameraFraming: text("camera_framing"),
    faceVisibilityRule: text("face_visibility_rule"),
    thumbnailUrl: text("thumbnail_url"),
    previewImageUrl: text("preview_image_url"),
    storagePath: text("storage_path"),
    colorHex: text("color_hex"),
    displayOrder: integer("display_order").notNull().default(0),
    isActive: boolean("is_active").notNull().default(true),
    metadata: jsonb("metadata").$type<Record<string, any>>().default({}),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("presentations_workspace_idx").on(table.workspace),
    index("presentations_gender_target_idx").on(table.genderTarget),
    index("presentations_wear_type_idx").on(table.wearTypeId),
    index("presentations_is_active_idx").on(table.isActive),
  ]
);

// 9d. Backgrounds Table (Studio, Plain Colors, Outdoor, Festive, Luxury)
export const backgrounds = pgTable(
  "backgrounds",
  {
    id: text("id").primaryKey(),
    workspace: text("workspace")
      .notNull()
      .default("all")
      .references(() => workspaces.id, { onDelete: "restrict", onUpdate: "cascade" }),
    genderTarget: text("gender_target")
      .default("all")
      .references(() => genders.id, { onDelete: "set default", onUpdate: "cascade" }),
    wearTypeId: text("wear_type_id").references(() => wearTypes.id, { onDelete: "set null", onUpdate: "cascade" }),
    subCategory: text("sub_category"),
    nameEn: text("name_en").notNull(),
    nameTe: text("name_te").notNull(),
    promptDirective: text("prompt_directive").notNull(),
    cameraFraming: text("camera_framing"),
    faceVisibilityRule: text("face_visibility_rule"),
    thumbnailUrl: text("thumbnail_url"),
    previewImageUrl: text("preview_image_url"),
    storagePath: text("storage_path"),
    colorHex: text("color_hex"),
    displayOrder: integer("display_order").notNull().default(0),
    isActive: boolean("is_active").notNull().default(true),
    metadata: jsonb("metadata").$type<Record<string, any>>().default({}),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("backgrounds_workspace_idx").on(table.workspace),
    index("backgrounds_gender_target_idx").on(table.genderTarget),
    index("backgrounds_wear_type_idx").on(table.wearTypeId),
    index("backgrounds_sub_category_idx").on(table.subCategory),
    index("backgrounds_is_active_idx").on(table.isActive),
  ]
);

// Backward-compatible alias for background table/view
export const background = backgrounds;

// Backward-compatible view representing union of all 4 studio tables (faces, poses, presentations, backgrounds)
export const studioPresets = pgTable(
  "studio_presets",
  {
    id: text("id").primaryKey(),
    type: text("type").notNull(),
    workspace: text("workspace").notNull(),
    genderTarget: text("gender_target"),
    wearTypeId: text("wear_type_id"),
    nameEn: text("name_en").notNull(),
    nameTe: text("name_te").notNull(),
    promptDirective: text("prompt_directive").notNull(),
    cameraFraming: text("camera_framing"),
    faceVisibilityRule: text("face_visibility_rule"),
    thumbnailUrl: text("thumbnail_url"),
    previewImageUrl: text("preview_image_url"),
    storagePath: text("storage_path"),
    colorHex: text("color_hex"),
    displayOrder: integer("display_order").notNull().default(0),
    isActive: boolean("is_active").notNull().default(true),
    metadata: jsonb("metadata").$type<Record<string, any>>().default({}),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  }
);

// 8. System Settings Table (AI Model Gateways, Pricing, Fidelity Guardrails)
export const systemSettings = pgTable(
  "system_settings",
  {
    key: text("key").primaryKey(), // e.g. 'ai_gateway', 'pricing_rules', 'fidelity_directives', 'negative_exclusions'
    category: text("category", { enum: ["ai", "pricing", "fidelity", "security", "general"] }).notNull(),
    value: jsonb("value").notNull(),
    description: text("description"),
    updatedBy: uuid("updated_by").references(() => users.id, { onDelete: "set null" }),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("system_settings_category_idx").on(table.category),
  ]
);

// 9. System Lookups Table (Lookup Categories & System Classifiers)
export const systemLookups = pgTable(
  "system_lookups",
  {
    id: text("id").primaryKey(), // e.g. 'bg_indoor', 'gender_male', 'garment_top_wear', 'jewelry_neck_wear'
    type: text("type", { enum: ["background_type", "gender", "garment_category", "jewelry_category"] }).notNull(),
    code: text("code").notNull(),
    nameEn: text("name_en").notNull(),
    nameTe: text("name_te").notNull(),
    description: text("description"),
    icon: text("icon"),
    displayOrder: integer("display_order").notNull().default(0),
    isActive: boolean("is_active").notNull().default(true),
    metadata: jsonb("metadata").$type<Record<string, any>>().default({}),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("system_lookups_type_idx").on(table.type),
    index("system_lookups_code_idx").on(table.code),
    index("system_lookups_is_active_idx").on(table.isActive),
  ]
);

// Drizzle Relations
export const usersRelations = relations(users, ({ many }) => ({
  payments: many(payments),
  usageLogs: many(usage),
}));

export const paymentsRelations = relations(payments, ({ one }) => ({
  user: one(users, {
    fields: [payments.userId],
    references: [users.id],
  }),
}));

export const usageRelations = relations(usage, ({ one }) => ({
  user: one(users, {
    fields: [usage.userId],
    references: [users.id],
  }),
}));

export const businessCategoriesRelations = relations(businessCategories, ({ many }) => ({
  catalogItems: many(catalogItems),
}));

export const wearTypesRelations = relations(wearTypes, ({ one, many }) => ({
  workspace: one(workspaces, {
    fields: [wearTypes.workspace],
    references: [workspaces.id],
  }),
  catalogItems: many(catalogItems),
  faces: many(faces),
  poses: many(poses),
  presentations: many(presentations),
  backgrounds: many(backgrounds),
  studioPresets: many(studioPresets),
}));

export const catalogItemsRelations = relations(catalogItems, ({ one, many }) => ({
  businessCategory: one(businessCategories, {
    fields: [catalogItems.businessCategoryId],
    references: [businessCategories.id],
  }),
  wearType: one(wearTypes, {
    fields: [catalogItems.wearType],
    references: [wearTypes.id],
  }),
  presentations: many(catalogItemPresentations),
  backgrounds: many(catalogItemBackgrounds),
  poses: many(catalogItemPoses),
}));

export const catalogItemPresentationsRelations = relations(catalogItemPresentations, ({ one }) => ({
  catalogItem: one(catalogItems, {
    fields: [catalogItemPresentations.catalogItemId],
    references: [catalogItems.id],
  }),
  presentation: one(presentations, {
    fields: [catalogItemPresentations.presentationId],
    references: [presentations.id],
  }),
}));

export const catalogItemBackgroundsRelations = relations(catalogItemBackgrounds, ({ one }) => ({
  catalogItem: one(catalogItems, {
    fields: [catalogItemBackgrounds.catalogItemId],
    references: [catalogItems.id],
  }),
  background: one(backgrounds, {
    fields: [catalogItemBackgrounds.backgroundId],
    references: [backgrounds.id],
  }),
}));

export const catalogItemPosesRelations = relations(catalogItemPoses, ({ one }) => ({
  catalogItem: one(catalogItems, {
    fields: [catalogItemPoses.catalogItemId],
    references: [catalogItems.id],
  }),
  pose: one(poses, {
    fields: [catalogItemPoses.poseId],
    references: [poses.id],
  }),
}));

export const facesRelations = relations(faces, ({ one }) => ({
  workspace: one(workspaces, {
    fields: [faces.workspace],
    references: [workspaces.id],
  }),
  gender: one(genders, {
    fields: [faces.genderTarget],
    references: [genders.id],
  }),
  wearType: one(wearTypes, {
    fields: [faces.wearTypeId],
    references: [wearTypes.id],
  }),
}));

export const posesRelations = relations(poses, ({ one, many }) => ({
  workspace: one(workspaces, {
    fields: [poses.workspace],
    references: [workspaces.id],
  }),
  gender: one(genders, {
    fields: [poses.genderTarget],
    references: [genders.id],
  }),
  wearType: one(wearTypes, {
    fields: [poses.wearTypeId],
    references: [wearTypes.id],
  }),
  catalogItems: many(catalogItemPoses),
}));

export const presentationsRelations = relations(presentations, ({ one, many }) => ({
  workspace: one(workspaces, {
    fields: [presentations.workspace],
    references: [workspaces.id],
  }),
  gender: one(genders, {
    fields: [presentations.genderTarget],
    references: [genders.id],
  }),
  wearType: one(wearTypes, {
    fields: [presentations.wearTypeId],
    references: [wearTypes.id],
  }),
  catalogItems: many(catalogItemPresentations),
}));

export const backgroundsRelations = relations(backgrounds, ({ one, many }) => ({
  workspace: one(workspaces, {
    fields: [backgrounds.workspace],
    references: [workspaces.id],
  }),
  gender: one(genders, {
    fields: [backgrounds.genderTarget],
    references: [genders.id],
  }),
  wearType: one(wearTypes, {
    fields: [backgrounds.wearTypeId],
    references: [wearTypes.id],
  }),
  catalogItems: many(catalogItemBackgrounds),
}));

export const studioPresetsRelations = relations(studioPresets, ({ one }) => ({
  wearType: one(wearTypes, {
    fields: [studioPresets.wearTypeId],
    references: [wearTypes.id],
  }),
}));

export const gendersRelations = relations(genders, ({ many }) => ({
  businessCategories: many(businessCategories),
  catalogItems: many(catalogItems),
  faces: many(faces),
  poses: many(poses),
  presentations: many(presentations),
  backgrounds: many(backgrounds),
  studioPresets: many(studioPresets),
  users: many(users),
}));

export const workspacesRelations = relations(workspaces, ({ many }) => ({
  businessCategories: many(businessCategories),
  wearTypes: many(wearTypes),
  catalogItems: many(catalogItems),
  faces: many(faces),
  poses: many(poses),
  presentations: many(presentations),
  backgrounds: many(backgrounds),
  studioPresets: many(studioPresets),
  usage: many(usage),
}));

// Export Inferred Types
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Otp = typeof otps.$inferSelect;
export type NewOtp = typeof otps.$inferInsert;
export type Payment = typeof payments.$inferSelect;
export type NewPayment = typeof payments.$inferInsert;
export type Usage = typeof usage.$inferSelect;
export type NewUsage = typeof usage.$inferInsert;
export type Gender = typeof genders.$inferSelect;
export type NewGender = typeof genders.$inferInsert;
export type Workspace = typeof workspaces.$inferSelect;
export type NewWorkspace = typeof workspaces.$inferInsert;
export type BusinessCategory = typeof businessCategories.$inferSelect;
export type NewBusinessCategory = typeof businessCategories.$inferInsert;
export type WearType = typeof wearTypes.$inferSelect;
export type NewWearType = typeof wearTypes.$inferInsert;
export type CatalogItem = typeof catalogItems.$inferSelect;
export type NewCatalogItem = typeof catalogItems.$inferInsert;
export type Face = typeof faces.$inferSelect;
export type NewFace = typeof faces.$inferInsert;
export type Pose = typeof poses.$inferSelect;
export type NewPose = typeof poses.$inferInsert;
export type Presentation = typeof presentations.$inferSelect;
export type NewPresentation = typeof presentations.$inferInsert;
export type Background = typeof backgrounds.$inferSelect;
export type NewBackground = typeof backgrounds.$inferInsert;
export type StudioPreset = typeof studioPresets.$inferSelect;
export type NewStudioPreset = typeof studioPresets.$inferInsert;
export type SystemSetting = typeof systemSettings.$inferSelect;
export type NewSystemSetting = typeof systemSettings.$inferInsert;
export type SystemLookup = typeof systemLookups.$inferSelect;
export type NewSystemLookup = typeof systemLookups.$inferInsert;
export type CatalogItemPresentation = typeof catalogItemPresentations.$inferSelect;
export type NewCatalogItemPresentation = typeof catalogItemPresentations.$inferInsert;
export type CatalogItemBackground = typeof catalogItemBackgrounds.$inferSelect;
export type NewCatalogItemBackground = typeof catalogItemBackgrounds.$inferInsert;
export type CatalogItemPose = typeof catalogItemPoses.$inferSelect;
export type NewCatalogItemPose = typeof catalogItemPoses.$inferInsert;

