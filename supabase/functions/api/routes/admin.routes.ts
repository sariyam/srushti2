import { Router } from "express";
import { AdminController, adjustCreditsSchema } from "../controllers/admin.controller";
import { CatalogController } from "../controllers/catalog.controller";
import { PresetController } from "../controllers/preset.controller";
import { BusinessController } from "../controllers/business.controller";
import { SettingsController } from "../controllers/settings.controller";
import { FacesController, faceUploadMiddleware } from "../controllers/faces.controller";
import { PosesController } from "../controllers/poses.controller";
import { PresentationsController } from "../controllers/presentations.controller";
import { BackgroundsController } from "../controllers/backgrounds.controller";
import { LookupController } from "../controllers/lookup.controller";
import { GenderController } from "../controllers/gender.controller";
import { WorkspaceController } from "../controllers/workspace.controller";
import { WearTypeController } from "../controllers/wear_type.controller";
import { authenticateToken, requireRole } from "../middlewares/auth";
import { validateBody } from "../middlewares/validate";
import { CreateCatalogItemSchema, UpdateCatalogItemSchema } from "../schemas/catalog.schema";
import {
  CreateStudioPresetSchema,
  UpdateStudioPresetSchema,
  CreateFaceSchema,
  UpdateFaceSchema,
  CreatePoseSchema,
  UpdatePoseSchema,
  CreatePresentationSchema,
  UpdatePresentationSchema,
  CreateBackgroundSchema,
  UpdateBackgroundSchema,
} from "../schemas/preset.schema";
import { CreateBusinessCategorySchema, UpdateBusinessCategorySchema } from "../schemas/business.schema";
import { UpdateSystemSettingSchema } from "../schemas/settings.schema";
import { CreateSystemLookupSchema, UpdateSystemLookupSchema } from "../schemas/lookup.schema";
import { CreateGenderSchema, UpdateGenderSchema } from "../schemas/gender.schema";
import { CreateWorkspaceSchema, UpdateWorkspaceSchema } from "../schemas/workspace.schema";
import { CreateWearTypeSchema, UpdateWearTypeSchema } from "../schemas/wear_type.schema";

const router = Router();

// Apply admin authentication to all admin routes
router.use(authenticateToken, requireRole(["admin"]));

// =============================================================================
// 1. Users, Usage & Credit Operations
// =============================================================================
router.get("/users", AdminController.getAllUsers);
router.get("/stats", AdminController.getStats);
router.get("/usage", AdminController.getUsageLogs);
router.post("/credits/adjust", validateBody(adjustCreditsSchema), AdminController.adjustCredits);
router.patch("/users/:userId/status", AdminController.toggleUserStatus);

// =============================================================================
// 2. Business Categories & Verticals
// =============================================================================
router.get("/businesses", BusinessController.getAll);
router.get("/businesses/:id", BusinessController.getById);
router.post("/businesses", validateBody(CreateBusinessCategorySchema), BusinessController.create);
router.put("/businesses/:id", validateBody(UpdateBusinessCategorySchema), BusinessController.update);
router.delete("/businesses/:id", BusinessController.delete);

// =============================================================================
// 3. Catalog Items (Garments, Jewelry, Gender Collections, Prompt Directives)
// =============================================================================
router.get("/catalog", CatalogController.getAll);
router.get("/catalog/:id", CatalogController.getById);
router.post("/catalog", validateBody(CreateCatalogItemSchema), CatalogController.create);
router.put("/catalog/:id", validateBody(UpdateCatalogItemSchema), CatalogController.update);
router.delete("/catalog/:id", CatalogController.delete);
router.patch("/catalog/:id/status", CatalogController.toggleStatus);

// =============================================================================
// 4. Studio Presets (Unified Endpoint for All 4 Tables)
// =============================================================================
router.get("/presets", PresetController.getAll);
router.get("/presets/:id", PresetController.getById);
router.post("/presets", validateBody(CreateStudioPresetSchema), PresetController.create);
router.put("/presets/:id", validateBody(UpdateStudioPresetSchema), PresetController.update);
router.delete("/presets/:id", PresetController.delete);
router.patch("/presets/:id/status", PresetController.toggleStatus);

// =============================================================================
// 5a. Faces (Model Faces & Headshots Table)
// =============================================================================
router.get("/faces", FacesController.getAll);
router.get("/faces/:id", FacesController.getById);
router.post("/faces", validateBody(CreateFaceSchema), FacesController.create);
router.put("/faces/:id", validateBody(UpdateFaceSchema), FacesController.update);
router.patch("/faces/:id/status", FacesController.toggleStatus);
router.delete("/faces/:id", FacesController.deleteFace);
router.post("/faces/upload", faceUploadMiddleware.single("file"), FacesController.uploadFace);
router.put("/faces/:id/replace", faceUploadMiddleware.single("file"), FacesController.replacePhoto);

// =============================================================================
// 5b. Poses (Model Poses, Camera Angles & Framing Table)
// =============================================================================
router.get("/poses", PosesController.getAll);
router.get("/poses/:id", PosesController.getById);
router.post("/poses", validateBody(CreatePoseSchema), PosesController.create);
router.put("/poses/:id", validateBody(UpdatePoseSchema), PosesController.update);
router.delete("/poses/:id", PosesController.delete);
router.patch("/poses/:id/status", PosesController.toggleStatus);

// =============================================================================
// 5c. Presentations (Presentation Modes Table: Model, Flatlay, Mannequin, etc.)
// =============================================================================
router.get("/presentations", PresentationsController.getAll);
router.get("/presentations/:id", PresentationsController.getById);
router.post("/presentations", validateBody(CreatePresentationSchema), PresentationsController.create);
router.put("/presentations/:id", validateBody(UpdatePresentationSchema), PresentationsController.update);
router.delete("/presentations/:id", PresentationsController.delete);
router.patch("/presentations/:id/status", PresentationsController.toggleStatus);

// =============================================================================
// 5d. Backgrounds (Studio Backgrounds Table: Solid, Luxury, Outdoor, etc.)
// =============================================================================
router.get("/backgrounds", BackgroundsController.getAll);
router.get("/backgrounds/:id", BackgroundsController.getById);
router.post("/backgrounds", validateBody(CreateBackgroundSchema), BackgroundsController.create);
router.put("/backgrounds/:id", validateBody(UpdateBackgroundSchema), BackgroundsController.update);
router.delete("/backgrounds/:id", BackgroundsController.delete);
router.patch("/backgrounds/:id/status", BackgroundsController.toggleStatus);

// =============================================================================
// 6. System Settings (AI Gateways, Pricing Rules, Fidelity Directives)
// =============================================================================
router.get("/settings", SettingsController.getAll);
router.get("/settings/:key", SettingsController.getByKey);
router.put("/settings/:key", validateBody(UpdateSystemSettingSchema), SettingsController.updateByKey);

// =============================================================================
// 7. System Lookups (Background Types, Genders)
// =============================================================================
router.get("/lookups", LookupController.getAllAdmin);
router.post("/lookups", validateBody(CreateSystemLookupSchema), LookupController.create);
router.put("/lookups/:id", validateBody(UpdateSystemLookupSchema), LookupController.update);
router.delete("/lookups/:id", LookupController.delete);

// =============================================================================
// 8. Gender Demographics Lookup & FK Reference Management
// =============================================================================
router.get("/genders", GenderController.getAllAdmin);
router.get("/genders/:id", GenderController.getById);
router.post("/genders", validateBody(CreateGenderSchema), GenderController.create);
router.put("/genders/:id", validateBody(UpdateGenderSchema), GenderController.update);
router.delete("/genders/:id", GenderController.delete);

// =============================================================================
// 9. Workspaces Lookup & FK Reference Management
// =============================================================================
router.get("/workspaces", WorkspaceController.getAllAdmin);
router.get("/workspaces/:id", WorkspaceController.getById);
router.post("/workspaces", validateBody(CreateWorkspaceSchema), WorkspaceController.create);
router.put("/workspaces/:id", validateBody(UpdateWorkspaceSchema), WorkspaceController.update);
router.delete("/workspaces/:id", WorkspaceController.delete);

// =============================================================================
// 10. Wear Types Lookup & FK Reference Management
// =============================================================================
router.get("/wear-types", WearTypeController.getAllAdmin);
router.get("/wear-types/:id", WearTypeController.getById);
router.post("/wear-types", validateBody(CreateWearTypeSchema), WearTypeController.create);
router.put("/wear-types/:id", validateBody(UpdateWearTypeSchema), WearTypeController.update);
router.delete("/wear-types/:id", WearTypeController.delete);

export default router;
