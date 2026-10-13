import { Request, Response } from "express";
import { db } from "../config";
import { studioPresets, faces, poses, presentations, backgrounds } from "../config/schema";
import { eq, and, asc, sql } from "drizzle-orm";
import { asyncHandler, BadRequestError, NotFoundError } from "../utils";

/**
 * Helper to identify which of the 4 physical tables holds a preset ID
 */
async function findPresetTable(id: string): Promise<"face" | "pose" | "presentation" | "background" | null> {
  const [face] = await db.select({ id: faces.id }).from(faces).where(eq(faces.id, id)).limit(1);
  if (face) return "face";

  const [pose] = await db.select({ id: poses.id }).from(poses).where(eq(poses.id, id)).limit(1);
  if (pose) return "pose";

  const [pres] = await db.select({ id: presentations.id }).from(presentations).where(eq(presentations.id, id)).limit(1);
  if (pres) return "presentation";

  const [bg] = await db.select({ id: backgrounds.id }).from(backgrounds).where(eq(backgrounds.id, id)).limit(1);
  if (bg) return "background";

  return null;
}

export class PresetController {
  /**
   * GET /api/admin/presets
   * List presets by type (pose, background, face, presentation, style), workspace, isActive
   */
  static getAll = asyncHandler(async (req: Request, res: Response) => {
    const { type, workspace, isActive, limit = "100", offset = "0" } = req.query as Record<string, string>;

    // If a specific type is queried, we can query its dedicated table directly
    if (type === "face") {
      const conditions: any[] = [];
      if (workspace && ["garment", "jewelry", "all"].includes(workspace)) {
        conditions.push(eq(faces.workspace, workspace as any));
      }
      if (isActive !== undefined) {
        conditions.push(eq(faces.isActive, isActive === "true"));
      }
      const whereClause = conditions.length > 0 ? and(...conditions) : undefined;
      const items = await db
        .select()
        .from(faces)
        .where(whereClause)
        .orderBy(asc(faces.displayOrder))
        .limit(Number(limit) || 100)
        .offset(Number(offset) || 0);

      const [countResult] = await db.select({ count: sql<number>`count(*)::int` }).from(faces).where(whereClause);
      const mapped = items.map((i) => ({ ...i, type: "face" as const }));
      return res.status(200).json({ success: true, presets: mapped, total: countResult?.count || mapped.length });
    }

    if (type === "pose") {
      const conditions: any[] = [];
      if (workspace && ["garment", "jewelry", "all"].includes(workspace)) {
        conditions.push(eq(poses.workspace, workspace as any));
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

      const [countResult] = await db.select({ count: sql<number>`count(*)::int` }).from(poses).where(whereClause);
      const mapped = items.map((i) => ({ ...i, type: "pose" as const }));
      return res.status(200).json({ success: true, presets: mapped, total: countResult?.count || mapped.length });
    }

    if (type === "presentation") {
      const conditions: any[] = [];
      if (workspace && ["garment", "jewelry", "all"].includes(workspace)) {
        conditions.push(eq(presentations.workspace, workspace as any));
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

      const [countResult] = await db.select({ count: sql<number>`count(*)::int` }).from(presentations).where(whereClause);
      const mapped = items.map((i) => ({ ...i, type: "presentation" as const }));
      return res.status(200).json({ success: true, presets: mapped, total: countResult?.count || mapped.length });
    }

    if (type === "background") {
      const conditions: any[] = [];
      if (workspace && ["garment", "jewelry", "all"].includes(workspace)) {
        conditions.push(eq(backgrounds.workspace, workspace as any));
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

      const [countResult] = await db.select({ count: sql<number>`count(*)::int` }).from(backgrounds).where(whereClause);
      const mapped = items.map((i) => ({ ...i, type: "background" as const }));
      return res.status(200).json({ success: true, presets: mapped, total: countResult?.count || mapped.length });
    }

    // Default: query unified view
    const conditions: any[] = [];
    if (workspace && ["garment", "jewelry", "all"].includes(workspace)) {
      conditions.push(eq(studioPresets.workspace, workspace as any));
    }
    if (isActive !== undefined) {
      conditions.push(eq(studioPresets.isActive, isActive === "true"));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const presets = await db
      .select()
      .from(studioPresets)
      .where(whereClause)
      .orderBy(asc(studioPresets.displayOrder))
      .limit(Number(limit) || 100)
      .offset(Number(offset) || 0);

    const [countResult] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(studioPresets)
      .where(whereClause);

    return res.status(200).json({
      success: true,
      presets,
      total: countResult?.count || presets.length,
    });
  });

  /**
   * GET /api/admin/presets/:id
   */
  static getById = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const [preset] = await db.select().from(studioPresets).where(eq(studioPresets.id, id)).limit(1);

    if (!preset) {
      throw new NotFoundError(`Studio preset with ID '${id}' not found.`, undefined, "PRESET_NOT_FOUND");
    }

    return res.status(200).json({ success: true, preset });
  });

  /**
   * POST /api/admin/presets
   * Routes the insert to the corresponding physical table (faces, poses, presentations, backgrounds)
   */
  static create = asyncHandler(async (req: Request, res: Response) => {
    const payload = req.body;
    const id = (payload.id || payload.nameEn).toLowerCase().replace(/[^a-z0-9_-]/g, "_");
    const type = payload.type || "pose";

    const commonValues = {
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
    };

    let created: any;
    if (type === "face") {
      [created] = await db.insert(faces).values(commonValues).returning();
    } else if (type === "presentation") {
      [created] = await db.insert(presentations).values(commonValues).returning();
    } else if (type === "background") {
      [created] = await db.insert(backgrounds).values(commonValues).returning();
    } else {
      [created] = await db.insert(poses).values(commonValues).returning();
    }

    return res.status(201).json({
      success: true,
      preset: { ...created, type },
    });
  });

  /**
   * PUT /api/admin/presets/:id
   * Updates the corresponding record in its physical table
   */
  static update = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const payload = req.body;

    const targetTable = payload.type || (await findPresetTable(id));
    if (!targetTable) {
      throw new NotFoundError(`Studio preset with ID '${id}' not found.`, undefined, "PRESET_NOT_FOUND");
    }

    const updateValues: Record<string, any> = {
      updatedAt: new Date(),
    };

    if (payload.workspace !== undefined) updateValues.workspace = payload.workspace;
    if (payload.genderTarget !== undefined) updateValues.genderTarget = payload.genderTarget;
    if (payload.wearTypeId !== undefined) updateValues.wearTypeId = payload.wearTypeId;
    if (payload.subCategory !== undefined) updateValues.subCategory = payload.subCategory;
    if (payload.nameEn !== undefined) updateValues.nameEn = payload.nameEn;
    if (payload.nameTe !== undefined) updateValues.nameTe = payload.nameTe;
    if (payload.promptDirective !== undefined) updateValues.promptDirective = payload.promptDirective;
    if (payload.cameraFraming !== undefined) updateValues.cameraFraming = payload.cameraFraming;
    if (payload.faceVisibilityRule !== undefined) updateValues.faceVisibilityRule = payload.faceVisibilityRule;
    if (payload.thumbnailUrl !== undefined) updateValues.thumbnailUrl = payload.thumbnailUrl;
    if (payload.previewImageUrl !== undefined) updateValues.previewImageUrl = payload.previewImageUrl;
    if (payload.storagePath !== undefined) updateValues.storagePath = payload.storagePath;
    if (payload.colorHex !== undefined) updateValues.colorHex = payload.colorHex;
    if (payload.displayOrder !== undefined) updateValues.displayOrder = Number(payload.displayOrder);
    if (payload.isActive !== undefined) updateValues.isActive = Boolean(payload.isActive);
    if (payload.metadata !== undefined) updateValues.metadata = payload.metadata;

    let updated: any;
    if (targetTable === "face") {
      [updated] = await db.update(faces).set(updateValues).where(eq(faces.id, id)).returning();
    } else if (targetTable === "presentation") {
      [updated] = await db.update(presentations).set(updateValues).where(eq(presentations.id, id)).returning();
    } else if (targetTable === "background") {
      [updated] = await db.update(backgrounds).set(updateValues).where(eq(backgrounds.id, id)).returning();
    } else {
      [updated] = await db.update(poses).set(updateValues).where(eq(poses.id, id)).returning();
    }

    if (!updated) {
      throw new NotFoundError(`Studio preset with ID '${id}' not found.`, undefined, "PRESET_NOT_FOUND");
    }

    return res.status(200).json({
      success: true,
      preset: { ...updated, type: targetTable },
    });
  });

  /**
   * DELETE /api/admin/presets/:id
   * Deletes from the matching physical table
   */
  static delete = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    const targetTable = await findPresetTable(id);
    if (!targetTable) {
      throw new NotFoundError(`Studio preset with ID '${id}' not found.`, undefined, "PRESET_NOT_FOUND");
    }

    let deleted: any;
    if (targetTable === "face") {
      [deleted] = await db.delete(faces).where(eq(faces.id, id)).returning();
    } else if (targetTable === "presentation") {
      [deleted] = await db.delete(presentations).where(eq(presentations.id, id)).returning();
    } else if (targetTable === "background") {
      [deleted] = await db.delete(backgrounds).where(eq(backgrounds.id, id)).returning();
    } else {
      [deleted] = await db.delete(poses).where(eq(poses.id, id)).returning();
    }

    if (!deleted) {
      throw new NotFoundError(`Studio preset with ID '${id}' not found.`, undefined, "PRESET_NOT_FOUND");
    }

    return res.status(200).json({
      success: true,
      message: `Studio preset '${id}' deleted successfully from '${targetTable}' table.`,
    });
  });

  /**
   * PATCH /api/admin/presets/:id/status
   */
  static toggleStatus = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { isActive } = req.body;

    const targetTable = await findPresetTable(id);
    if (!targetTable) {
      throw new NotFoundError(`Studio preset with ID '${id}' not found.`, undefined, "PRESET_NOT_FOUND");
    }

    let updated: any;
    const updateData = {
      isActive: Boolean(isActive),
      updatedAt: new Date(),
    };

    if (targetTable === "face") {
      [updated] = await db.update(faces).set(updateData).where(eq(faces.id, id)).returning();
    } else if (targetTable === "presentation") {
      [updated] = await db.update(presentations).set(updateData).where(eq(presentations.id, id)).returning();
    } else if (targetTable === "background") {
      [updated] = await db.update(backgrounds).set(updateData).where(eq(backgrounds.id, id)).returning();
    } else {
      [updated] = await db.update(poses).set(updateData).where(eq(poses.id, id)).returning();
    }

    if (!updated) {
      throw new NotFoundError(`Studio preset with ID '${id}' not found.`, undefined, "PRESET_NOT_FOUND");
    }

    return res.status(200).json({
      success: true,
      preset: { ...updated, type: targetTable },
    });
  });
}
