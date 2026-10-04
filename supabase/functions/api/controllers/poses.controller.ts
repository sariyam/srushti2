import { Request, Response } from "express";
import { db } from "../config";
import { poses } from "../config/schema";
import { eq, and, asc, sql } from "drizzle-orm";
import { asyncHandler, NotFoundError } from "../utils";

export class PosesController {
  /**
   * GET /api/admin/poses
   */
  static getAll = asyncHandler(async (req: Request, res: Response) => {
    const { workspace, genderTarget, wearTypeId, isActive, limit = "100", offset = "0" } = req.query as Record<string, string>;

    const conditions: any[] = [];
    if (workspace && ["garment", "jewelry", "all"].includes(workspace)) {
      conditions.push(eq(poses.workspace, workspace as any));
    }
    if (genderTarget) {
      conditions.push(eq(poses.genderTarget, genderTarget));
    }
    if (wearTypeId) {
      conditions.push(eq(poses.wearTypeId, wearTypeId));
    }
    if (isActive !== undefined) {
      conditions.push(eq(poses.isActive, isActive === "true"));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const items = await db
      .select()
      .from(poses)
      .where(whereClause)
      .orderBy(asc(poses.displayOrder))
      .limit(Number(limit) || 100)
      .offset(Number(offset) || 0);

    const [countResult] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(poses)
      .where(whereClause);

    return res.status(200).json({
      success: true,
      poses: items,
      total: countResult?.count || items.length,
    });
  });

  /**
   * GET /api/admin/poses/:id
   */
  static getById = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const [pose] = await db.select().from(poses).where(eq(poses.id, id)).limit(1);

    if (!pose) {
      throw new NotFoundError(`Pose with ID '${id}' not found.`, undefined, "POSE_NOT_FOUND");
    }

    return res.status(200).json({ success: true, pose });
  });

  /**
   * POST /api/admin/poses
   */
  static create = asyncHandler(async (req: Request, res: Response) => {
    const payload = req.body;
    const id = (payload.id || payload.nameEn).toLowerCase().replace(/[^a-z0-9_-]/g, "_");

    const [newPose] = await db
      .insert(poses)
      .values({
        id,
        workspace: payload.workspace || "all",
        genderTarget: payload.genderTarget || "all",
        wearTypeId: payload.wearTypeId || null,
        subCategory: payload.subCategory || null,
        nameEn: payload.nameEn,
        nameTe: payload.nameTe || payload.nameEn,
        promptDirective: payload.promptDirective,
        cameraFraming: payload.cameraFraming || null,
        faceVisibilityRule: payload.faceVisibilityRule || null,
        thumbnailUrl: payload.thumbnailUrl || null,
        previewImageUrl: payload.previewImageUrl || null,
        storagePath: payload.storagePath || null,
        colorHex: payload.colorHex || null,
        displayOrder: Number(payload.displayOrder) || 0,
        isActive: payload.isActive !== undefined ? Boolean(payload.isActive) : true,
        metadata: payload.metadata || {},
      })
      .returning();

    return res.status(201).json({ success: true, pose: newPose });
  });

  /**
   * PUT /api/admin/poses/:id
   */
  static update = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const payload = req.body;

    const [updatedPose] = await db
      .update(poses)
      .set({
        ...payload,
        updatedAt: new Date(),
      })
      .where(eq(poses.id, id))
      .returning();

    if (!updatedPose) {
      throw new NotFoundError(`Pose with ID '${id}' not found.`, undefined, "POSE_NOT_FOUND");
    }

    return res.status(200).json({ success: true, pose: updatedPose });
  });

  /**
   * DELETE /api/admin/poses/:id
   */
  static delete = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    const [deleted] = await db.delete(poses).where(eq(poses.id, id)).returning();
    if (!deleted) {
      throw new NotFoundError(`Pose with ID '${id}' not found.`, undefined, "POSE_NOT_FOUND");
    }

    return res.status(200).json({
      success: true,
      message: `Pose '${id}' deleted successfully.`,
    });
  });

  /**
   * PATCH /api/admin/poses/:id/status
   */
  static toggleStatus = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { isActive } = req.body;

    const [updated] = await db
      .update(poses)
      .set({
        isActive: Boolean(isActive),
        updatedAt: new Date(),
      })
      .where(eq(poses.id, id))
      .returning();

    if (!updated) {
      throw new NotFoundError(`Pose with ID '${id}' not found.`, undefined, "POSE_NOT_FOUND");
    }

    return res.status(200).json({ success: true, pose: updated });
  });
}
