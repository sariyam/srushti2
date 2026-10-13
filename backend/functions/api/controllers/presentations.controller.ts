import { Request, Response } from "express";
import { db } from "../config";
import { presentations } from "../config/schema";
import { eq, and, asc, sql } from "drizzle-orm";
import { asyncHandler, NotFoundError } from "../utils";

export class PresentationsController {
  /**
   * GET /api/admin/presentations
   */
  static getAll = asyncHandler(async (req: Request, res: Response) => {
    const { workspace, genderTarget, wearTypeId, isActive, limit = "100", offset = "0" } = req.query as Record<string, string>;

    const conditions: any[] = [];
    if (workspace && ["garment", "jewelry", "all"].includes(workspace)) {
      conditions.push(eq(presentations.workspace, workspace as any));
    }
    if (genderTarget) {
      conditions.push(eq(presentations.genderTarget, genderTarget));
    }
    if (wearTypeId) {
      conditions.push(eq(presentations.wearTypeId, wearTypeId));
    }
    if (isActive !== undefined) {
      conditions.push(eq(presentations.isActive, isActive === "true"));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const items = await db
      .select()
      .from(presentations)
      .where(whereClause)
      .orderBy(asc(presentations.displayOrder))
      .limit(Number(limit) || 100)
      .offset(Number(offset) || 0);

    const [countResult] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(presentations)
      .where(whereClause);

    return res.status(200).json({
      success: true,
      presentations: items,
      total: countResult?.count || items.length,
    });
  });

  /**
   * GET /api/admin/presentations/:id
   */
  static getById = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const [presentation] = await db.select().from(presentations).where(eq(presentations.id, id)).limit(1);

    if (!presentation) {
      throw new NotFoundError(`Presentation mode with ID '${id}' not found.`, undefined, "PRESENTATION_NOT_FOUND");
    }

    return res.status(200).json({ success: true, presentation });
  });

  /**
   * POST /api/admin/presentations
   */
  static create = asyncHandler(async (req: Request, res: Response) => {
    const payload = req.body;
    const id = (payload.id || payload.nameEn).toLowerCase().replace(/[^a-z0-9_-]/g, "_");

    const [newPresentation] = await db
      .insert(presentations)
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
        faceVisibilityRule: payload.faceVisibilityRule || (id === "model" ? "full_face" : id === "partial_face" ? "partial_face" : "no_face"),
        thumbnailUrl: payload.thumbnailUrl || null,
        previewImageUrl: payload.previewImageUrl || null,
        storagePath: payload.storagePath || null,
        colorHex: payload.colorHex || null,
        displayOrder: Number(payload.displayOrder) || 0,
        isActive: payload.isActive !== undefined ? Boolean(payload.isActive) : true,
        metadata: payload.metadata || {},
      })
      .returning();

    return res.status(201).json({ success: true, presentation: newPresentation });
  });

  /**
   * PUT /api/admin/presentations/:id
   */
  static update = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const payload = req.body;

    const [updated] = await db
      .update(presentations)
      .set({
        ...payload,
        updatedAt: new Date(),
      })
      .where(eq(presentations.id, id))
      .returning();

    if (!updated) {
      throw new NotFoundError(`Presentation mode with ID '${id}' not found.`, undefined, "PRESENTATION_NOT_FOUND");
    }

    return res.status(200).json({ success: true, presentation: updated });
  });

  /**
   * DELETE /api/admin/presentations/:id
   */
  static delete = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    const [deleted] = await db.delete(presentations).where(eq(presentations.id, id)).returning();
    if (!deleted) {
      throw new NotFoundError(`Presentation mode with ID '${id}' not found.`, undefined, "PRESENTATION_NOT_FOUND");
    }

    return res.status(200).json({
      success: true,
      message: `Presentation mode '${id}' deleted successfully.`,
    });
  });

  /**
   * PATCH /api/admin/presentations/:id/status
   */
  static toggleStatus = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { isActive } = req.body;

    const [updated] = await db
      .update(presentations)
      .set({
        isActive: Boolean(isActive),
        updatedAt: new Date(),
      })
      .where(eq(presentations.id, id))
      .returning();

    if (!updated) {
      throw new NotFoundError(`Presentation mode with ID '${id}' not found.`, undefined, "PRESENTATION_NOT_FOUND");
    }

    return res.status(200).json({ success: true, presentation: updated });
  });
}
