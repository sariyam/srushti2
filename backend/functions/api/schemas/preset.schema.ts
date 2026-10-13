import { z } from "@hono/zod-openapi";

// Common base attributes for all studio assets
export const StudioPresetModel = z
  .object({
    id: z.string().openapi({ description: "Preset ID", example: "standing_front" }),
    type: z.enum(["pose", "background", "face", "presentation", "style"]).openapi({ example: "pose" }),
    workspace: z.enum(["garment", "jewelry", "all"]).openapi({ example: "garment" }),
    genderTarget: z.string().nullable().optional().openapi({ example: "female" }),
    wearTypeId: z.string().nullable().optional().openapi({ example: "top_wear" }),
    subCategory: z.string().nullable().optional().openapi({ example: "indian" }),
    nameEn: z.string().openapi({ example: "Standing Front" }),
    nameTe: z.string().openapi({ example: "ముందు నిలబడి (Front)" }),
    promptDirective: z.string().openapi({ example: "standing straight in a polished professional catalog front pose" }),
    cameraFraming: z.string().nullable().optional().openapi({ example: "eye-level medium portrait angle" }),
    faceVisibilityRule: z.string().nullable().optional().openapi({ example: "full_face" }),
    thumbnailUrl: z.string().nullable().optional(),
    previewImageUrl: z.string().nullable().optional().openapi({ example: "https://example.com/faces/ananya.jpg" }),
    storagePath: z.string().nullable().optional().openapi({ example: "model-faces/ananya.jpg" }),
    colorHex: z.string().nullable().optional().openapi({ example: "#FFFFFF" }),
    displayOrder: z.number().int().openapi({ example: 1 }),
    isActive: z.boolean().openapi({ example: true }),
    metadata: z.record(z.any()).optional().openapi({ example: { gender: "female" } }),
    createdAt: z.string().datetime().or(z.date()).openapi({ example: "2026-10-03T00:00:00Z" }),
    updatedAt: z.string().datetime().or(z.date()).openapi({ example: "2026-10-03T00:00:00Z" }),
  })
  .openapi("StudioPreset");

export const PresetQuerySchema = z
  .object({
    type: z.enum(["pose", "background", "face", "presentation", "style"]).optional().openapi({ example: "pose" }),
    workspace: z.enum(["garment", "jewelry", "all"]).optional().openapi({ example: "garment" }),
    genderTarget: z.string().optional().openapi({ example: "female" }),
    wearTypeId: z.string().optional().openapi({ example: "top_wear" }),
    isActive: z
      .string()
      .optional()
      .transform((val) => (val === undefined ? undefined : val === "true")),
    limit: z.string().optional().openapi({ example: "50" }),
    offset: z.string().optional().openapi({ example: "0" }),
  })
  .openapi("PresetQuery");

export const CreateStudioPresetSchema = z
  .object({
    id: z.string().min(2).max(100).openapi({ example: "twirling_pallu" }),
    type: z.enum(["pose", "background", "face", "presentation", "style"]).default("pose").openapi({ example: "pose" }),
    workspace: z.enum(["garment", "jewelry", "all"]).default("all").openapi({ example: "garment" }),
    genderTarget: z.string().optional().default("all").openapi({ example: "female" }),
    wearTypeId: z.string().nullable().optional().openapi({ example: "top_wear" }),
    subCategory: z.string().nullable().optional().openapi({ example: "indian" }),
    nameEn: z.string().min(1).max(100).openapi({ example: "Twirling Pallu" }),
    nameTe: z.string().min(1).max(100).openapi({ example: "పల్లూ తిప్పుతూ" }),
    promptDirective: z.string().min(3).max(1000).openapi({ example: "dynamic twirling motion showcasing the saree pallu" }),
    cameraFraming: z.string().max(255).nullable().optional().openapi({ example: "medium-wide slow-shutter blur framing" }),
    faceVisibilityRule: z.enum(["full_face", "partial_face", "no_face"]).nullable().optional().openapi({ example: "full_face" }),
    thumbnailUrl: z.string().nullable().optional(),
    previewImageUrl: z.string().nullable().optional(),
    storagePath: z.string().nullable().optional(),
    colorHex: z.string().regex(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/).nullable().optional(),
    displayOrder: z.number().int().default(0),
    isActive: z.boolean().default(true),
    metadata: z.record(z.any()).optional(),
  })
  .openapi("CreateStudioPresetRequest");

export const UpdateStudioPresetSchema = CreateStudioPresetSchema.partial().omit({ id: true }).openapi("UpdateStudioPresetRequest");

export const StudioPresetListResponseSchema = z
  .object({
    success: z.boolean().openapi({ example: true }),
    presets: z.array(StudioPresetModel),
    total: z.number().openapi({ example: 24 }),
  })
  .openapi("StudioPresetListResponse");

export const StudioPresetResponseSchema = z
  .object({
    success: z.boolean().openapi({ example: true }),
    preset: StudioPresetModel,
  })
  .openapi("StudioPresetResponse");

// =============================================================================
// 1. Faces Schemas
// =============================================================================
export const FaceModel = StudioPresetModel.omit({ type: true }).openapi("Face");

export const CreateFaceSchema = CreateStudioPresetSchema.omit({ type: true }).openapi("CreateFaceRequest");
export const UpdateFaceSchema = CreateFaceSchema.partial().omit({ id: true }).openapi("UpdateFaceRequest");

export const FaceListResponseSchema = z
  .object({
    success: z.boolean().openapi({ example: true }),
    faces: z.array(FaceModel),
    total: z.number().openapi({ example: 72 }),
  })
  .openapi("FaceListResponse");

export const FaceResponseSchema = z
  .object({
    success: z.boolean().openapi({ example: true }),
    face: FaceModel,
  })
  .openapi("FaceResponse");

// =============================================================================
// 2. Poses Schemas
// =============================================================================
export const PoseModel = StudioPresetModel.omit({ type: true }).openapi("Pose");

export const CreatePoseSchema = CreateStudioPresetSchema.omit({ type: true }).openapi("CreatePoseRequest");
export const UpdatePoseSchema = CreatePoseSchema.partial().omit({ id: true }).openapi("UpdatePoseRequest");

export const PoseListResponseSchema = z
  .object({
    success: z.boolean().openapi({ example: true }),
    poses: z.array(PoseModel),
    total: z.number().openapi({ example: 72 }),
  })
  .openapi("PoseListResponse");

export const PoseResponseSchema = z
  .object({
    success: z.boolean().openapi({ example: true }),
    pose: PoseModel,
  })
  .openapi("PoseResponse");

// =============================================================================
// 3. Presentations Schemas
// =============================================================================
export const PresentationModel = StudioPresetModel.omit({ type: true }).openapi("Presentation");

export const CreatePresentationSchema = CreateStudioPresetSchema.omit({ type: true }).openapi("CreatePresentationRequest");
export const UpdatePresentationSchema = CreatePresentationSchema.partial().omit({ id: true }).openapi("UpdatePresentationRequest");

export const PresentationListResponseSchema = z
  .object({
    success: z.boolean().openapi({ example: true }),
    presentations: z.array(PresentationModel),
    total: z.number().openapi({ example: 12 }),
  })
  .openapi("PresentationListResponse");

export const PresentationResponseSchema = z
  .object({
    success: z.boolean().openapi({ example: true }),
    presentation: PresentationModel,
  })
  .openapi("PresentationResponse");

// =============================================================================
// 4. Backgrounds Schemas
// =============================================================================
export const BackgroundModel = StudioPresetModel.omit({ type: true }).openapi("Background");

export const CreateBackgroundSchema = CreateStudioPresetSchema.omit({ type: true }).openapi("CreateBackgroundRequest");
export const UpdateBackgroundSchema = CreateBackgroundSchema.partial().omit({ id: true }).openapi("UpdateBackgroundRequest");

export const BackgroundListResponseSchema = z
  .object({
    success: z.boolean().openapi({ example: true }),
    backgrounds: z.array(BackgroundModel),
    total: z.number().openapi({ example: 15 }),
  })
  .openapi("BackgroundListResponse");

export const BackgroundResponseSchema = z
  .object({
    success: z.boolean().openapi({ example: true }),
    background: BackgroundModel,
  })
  .openapi("BackgroundResponse");

export type StudioPreset = z.infer<typeof StudioPresetModel>;
export type PresetQuery = z.infer<typeof PresetQuerySchema>;
export type CreateStudioPresetInput = z.infer<typeof CreateStudioPresetSchema>;
export type UpdateStudioPresetInput = z.infer<typeof UpdateStudioPresetSchema>;

export type FaceItem = z.infer<typeof FaceModel>;
export type PoseItem = z.infer<typeof PoseModel>;
export type PresentationItem = z.infer<typeof PresentationModel>;
export type BackgroundItem = z.infer<typeof BackgroundModel>;
