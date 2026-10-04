import { Router } from "express";
import { StudioController } from "../controllers/studio.controller";
import { LookupController } from "../controllers/lookup.controller";
import { GenderController } from "../controllers/gender.controller";
import { WorkspaceController } from "../controllers/workspace.controller";
import { WearTypeController } from "../controllers/wear_type.controller";

const router = Router();

// Public configuration endpoint for consumer photoshoot studio
router.get("/config", StudioController.getConfig);

// Public grouped lookups endpoint
router.get("/lookups", LookupController.getGrouped);

// Public active genders endpoint
router.get("/genders", GenderController.getAll);

// Public active workspaces endpoint
router.get("/workspaces", WorkspaceController.getAll);

// Public active wear types endpoint
router.get("/wear-types", WearTypeController.getAll);

export default router;
