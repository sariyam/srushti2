import { Request, Response } from "express";
import { db } from "../config";
import { backgrounds } from "../config/schema";
import { eq, and, asc, sql } from "drizzle-orm";
import { asyncHandler, NotFoundError } from "../utils";

export class BackgroundsController {
  /**
   * GET /api/admin/backgrounds
   */
  static getAll = asyncHandler(async (req: Request, res: Response) => {
    const { workspace, genderTarget, wearTypeId, isActive, limit = "100", offset = "0" } = req.query as Record<string, string>;

    const conditions: any[] = [];
    if (workspace && ["garment", "jewelry", "all"].includes(workspace)) {
      conditions.push(eq(backgrounds.workspace, workspace as any));
    }
    if (genderTarget) {
      conditions.push(eq(backgrounds.genderTarget, genderTarget));
    }
    if (wearTypeId) {
      conditions.push(eq(backgrounds.wearTypeId, wearTypeId));
    }
    if (isActive !== undefined) {
      conditions.push(eq(backgrounds.isActive, isActive === "true"));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const items = await db
      .select()
      .from(backgrounds)
      .where(whereClause)
      .orderBy(asc(backgrounds.displayOrder))
      .limit(Number(limit) || 100)
      .offset(Number(offset) || 0);

    const [countResult] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(backgrounds)
      .where(whereClause);

    return res.status(200).json({
      success: true,
      backgrounds: items,
      total: countResult?.count || items.length,
    });
  });

  /**
   * GET /api/admin/backgrounds/:id
   */
  static getById = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const [bg] = await db.select().from(backgrounds).where(eq(backgrounds.id, id)).limit(1);

    if (!bg) {
      throw new NotFoundError(`Background preset with ID '${id}' not found.`, undefined, "BACKGROUND_NOT_FOUND");
    }

    return res.status(200).json({ success: true, background: bg });
  });

  /**
   * POST /api/admin/backgrounds
   */
  static create = asyncHandler(async (req: Request, res: Response) => {
    const payload = req.body;
    const id = (payload.id || payload.nameEn).toLowerCase().replace(/[^a-z0-9_-]/g, "_");

    const [newBg] = await db
      .insert(backgrounds)
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

    return res.status(201).json({ success: true, background: newBg });
  });

  /**
   * PUT /api/admin/backgrounds/:id
   */
  static update = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const payload = req.body;

    const [updated] = await db
      .update(backgrounds)
      .set({
        ...payload,
        updatedAt: new Date(),
      })
      .where(eq(backgrounds.id, id))
      .returning();

    if (!updated) {
      throw new NotFoundError(`Background preset with ID '${id}' not found.`, undefined, "BACKGROUND_NOT_FOUND");
    }

    return res.status(200).json({ success: true, background: updated });
  });

  /**
   * DELETE /api/admin/backgrounds/:id
   */
  static delete = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    const [deleted] = await db.delete(backgrounds).where(eq(backgrounds.id, id)).returning();
    if (!deleted) {
      throw new NotFoundError(`Background preset with ID '${id}' not found.`, undefined, "BACKGROUND_NOT_FOUND");
    }

    return res.status(200).json({
      success: true,
      message: `Background preset '${id}' deleted successfully.`,
    });
  });

  /**
   * PATCH /api/admin/backgrounds/:id/status
   */
  static toggleStatus = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { isActive } = req.body;

    const [updated] = await db
      .update(backgrounds)
      .set({
        isActive: Boolean(isActive),
        updatedAt: new Date(),
      })
      .where(eq(backgrounds.id, id))
      .returning();

    if (!updated) {
      throw new NotFoundError(`Background preset with ID '${id}' not found.`, undefined, "BACKGROUND_NOT_FOUND");
    }

    return res.status(200).json({ success: true, background: updated });
  });
}
