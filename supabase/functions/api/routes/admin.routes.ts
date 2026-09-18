import { Router } from "express";
import { AdminController, adjustCreditsSchema } from "../controllers/admin.controller";
import { authenticateToken, requireRole } from "../middlewares/auth";
import { validateBody } from "../middlewares/validate";

const router = Router();

// Protected admin routes (Admins and SuperAdmins)
router.get("/users", authenticateToken, requireRole(["admin", "superadmin"]), AdminController.getAllUsers);
router.get("/stats", authenticateToken, requireRole(["admin", "superadmin"]), AdminController.getStats);
router.get("/usage", authenticateToken, requireRole(["admin", "superadmin"]), AdminController.getUsageLogs);

// SuperAdmin exclusive routes
router.post(
  "/credits/adjust",
  authenticateToken,
  requireRole(["superadmin"]),
  validateBody(adjustCreditsSchema),
  AdminController.adjustCredits
);
router.patch(
  "/users/:userId/status",
  authenticateToken,
  requireRole(["superadmin"]),
  AdminController.toggleUserStatus
);

export default router;
