import { Request, Response } from "express";
import { db } from "../config";
import { wearTypes, workspaces } from "../config/schema";
import { eq, and, asc } from "drizzle-orm";
import { asyncHandler } from "../utils";
import { NotFoundError, BadRequestError } from "../utils/errors";

export class WearTypeController {
  /**
   * GET /api/studio/wear-types or /api/wear-types
   * Returns active wear types ordered by displayOrder, with optional workspace filter
   */
  static getAll = asyncHandler(async (req: Request, res: Response) => {
    const { workspace } = req.query as { workspace?: string };

    const conditions = [eq(wearTypes.isActive, true)];
    if (workspace && workspace !== "all") {
      conditions.push(eq(wearTypes.workspace, workspace));
    }

    const list = await db
      .select()
      .from(wearTypes)
      .where(and(...conditions))
      .orderBy(asc(wearTypes.displayOrder));

    res.setHeader("Cache-Control", "public, max-age=60, stale-while-revalidate=300");

    return res.status(200).json({
      success: true,
      wearTypes: list,
    });
  });

  /**
   * GET /api/admin/wear-types
   * Admin endpoint to list all wear types with optional workspace and isActive filters
   */
  static getAllAdmin = asyncHandler(async (req: Request, res: Response) => {
    const { workspace, isActive } = req.query as { workspace?: string; isActive?: string };

    const conditions: any[] = [];
    if (workspace && workspace !== "all") {
      conditions.push(eq(wearTypes.workspace, workspace));
    }
    if (isActive !== undefined) {
      conditions.push(eq(wearTypes.isActive, isActive === "true"));
    }

    const query = db.select().from(wearTypes);
    if (conditions.length > 0) {
      query.where(and(...conditions));
    }

    const list = await query.orderBy(asc(wearTypes.displayOrder));

    return res.status(200).json({
      success: true,
      wearTypes: list,
    });
  });

  /**
   * GET /api/admin/wear-types/:id
   */
  static getById = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    const list = await db
      .select()
      .from(wearTypes)
      .where(eq(wearTypes.id, id))
      .limit(1);

    if (!list.length) {
      throw new NotFoundError(`Wear Type with ID '${id}' not found`);
    }

    return res.status(200).json({
      success: true,
      wearType: list[0],
    });
  });

  /**
   * POST /api/admin/wear-types
   */
  static create = asyncHandler(async (req: Request, res: Response) => {
    const { id, workspace, code, nameEn, nameTe, description, icon, displayOrder, isActive } = req.body;

    if (!id || !code || !nameEn || !nameTe) {
      throw new BadRequestError("id, code, nameEn, and nameTe are required");
    }

    // Verify workspace exists
    const targetWorkspace = workspace || "garment";
    const [ws] = await db
      .select()
      .from(workspaces)
      .where(eq(workspaces.id, targetWorkspace))
      .limit(1);

    if (!ws) {
      throw new BadRequestError(`Workspace '${targetWorkspace}' does not exist.`);
    }

    const existing = await db
      .select()
      .from(wearTypes)
      .where(eq(wearTypes.id, id))
      .limit(1);

    if (existing.length > 0) {
      throw new BadRequestError(`Wear Type with ID '${id}' already exists`);
    }

    const [created] = await db
      .insert(wearTypes)
      .values({
        id,
        workspace: targetWorkspace,
        code,
        nameEn,
        nameTe,
        description: description || null,
        icon: icon || null,
        displayOrder: displayOrder ?? 0,
        isActive: isActive !== undefined ? Boolean(isActive) : true,
      })
      .returning();

    return res.status(201).json({
      success: true,
      wearType: created,
    });
  });

  /**
   * PUT /api/admin/wear-types/:id
   */
  static update = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { workspace, nameEn, nameTe, description, icon, displayOrder, isActive } = req.body;

    const existing = await db
      .select()
      .from(wearTypes)
      .where(eq(wearTypes.id, id))
      .limit(1);

    if (!existing.length) {
      throw new NotFoundError(`Wear Type with ID '${id}' not found`);
    }

    if (workspace) {
      const [ws] = await db
        .select()
        .from(workspaces)
        .where(eq(workspaces.id, workspace))
        .limit(1);

      if (!ws) {
        throw new BadRequestError(`Workspace '${workspace}' does not exist.`);
      }
    }

    const updateData: Partial<typeof wearTypes.$inferInsert> = {
      updatedAt: new Date(),
    };

    if (workspace !== undefined) updateData.workspace = workspace;
    if (nameEn !== undefined) updateData.nameEn = nameEn;
    if (nameTe !== undefined) updateData.nameTe = nameTe;
    if (description !== undefined) updateData.description = description;
    if (icon !== undefined) updateData.icon = icon;
    if (displayOrder !== undefined) updateData.displayOrder = displayOrder;
    if (isActive !== undefined) updateData.isActive = Boolean(isActive);

    const [updated] = await db
      .update(wearTypes)
      .set(updateData)
      .where(eq(wearTypes.id, id))
      .returning();

    return res.status(200).json({
      success: true,
      wearType: updated,
    });
  });

  /**
   * DELETE /api/admin/wear-types/:id
   */
  static delete = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    const existing = await db
      .select()
      .from(wearTypes)
      .where(eq(wearTypes.id, id))
      .limit(1);

    if (!existing.length) {
      throw new NotFoundError(`Wear Type with ID '${id}' not found`);
    }

    // Try hard delete, fallback to soft deactivate if referenced by foreign keys
    try {
      await db.delete(wearTypes).where(eq(wearTypes.id, id));
      return res.status(200).json({
        success: true,
        message: `Wear Type '${id}' successfully deleted`,
      });
    } catch (err: any) {
      // If foreign key constraint prevents deletion, deactivate instead
      await db
        .update(wearTypes)
        .set({ isActive: false, updatedAt: new Date() })
        .where(eq(wearTypes.id, id));

      return res.status(200).json({
        success: true,
        message: `Wear Type '${id}' is referenced by catalog items or presets. It has been deactivated instead.`,
      });
    }
  });
}
