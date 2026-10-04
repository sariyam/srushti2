import { Request, Response } from "express";
import { db } from "../config";
import { workspaces } from "../config/schema";
import { eq, asc } from "drizzle-orm";
import { asyncHandler } from "../utils";
import { NotFoundError, BadRequestError } from "../utils/errors";

export class WorkspaceController {
  /**
   * GET /api/studio/workspaces or /api/workspaces
   * Returns active workspaces ordered by displayOrder
   */
  static getAll = asyncHandler(async (_req: Request, res: Response) => {
    const list = await db
      .select()
      .from(workspaces)
      .where(eq(workspaces.isActive, true))
      .orderBy(asc(workspaces.displayOrder));

    res.setHeader("Cache-Control", "public, max-age=60, stale-while-revalidate=300");

    return res.status(200).json({
      success: true,
      workspaces: list,
    });
  });

  /**
   * GET /api/admin/workspaces
   * Admin endpoint to list all workspaces with optional isActive filter
   */
  static getAllAdmin = asyncHandler(async (req: Request, res: Response) => {
    const { isActive } = req.query as { isActive?: string };

    const query = db.select().from(workspaces);
    if (isActive !== undefined) {
      query.where(eq(workspaces.isActive, isActive === "true"));
    }

    const list = await query.orderBy(asc(workspaces.displayOrder));

    return res.status(200).json({
      success: true,
      workspaces: list,
    });
  });

  /**
   * GET /api/admin/workspaces/:id
   */
  static getById = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    const list = await db
      .select()
      .from(workspaces)
      .where(eq(workspaces.id, id))
      .limit(1);

    if (!list.length) {
      throw new NotFoundError(`Workspace with ID '${id}' not found`);
    }

    return res.status(200).json({
      success: true,
      workspace: list[0],
    });
  });

  /**
   * POST /api/admin/workspaces
   */
  static create = asyncHandler(async (req: Request, res: Response) => {
    const { id, code, nameEn, nameTe, description, icon, displayOrder, isActive } = req.body;

    if (!id || !code || !nameEn || !nameTe) {
      throw new BadRequestError("id, code, nameEn, and nameTe are required");
    }

    const existing = await db
      .select()
      .from(workspaces)
      .where(eq(workspaces.id, id))
      .limit(1);

    if (existing.length > 0) {
      throw new BadRequestError(`Workspace with ID '${id}' already exists`);
    }

    const [created] = await db
      .insert(workspaces)
      .values({
        id,
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
      workspace: created,
    });
  });

  /**
   * PUT /api/admin/workspaces/:id
   */
  static update = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { nameEn, nameTe, description, icon, displayOrder, isActive } = req.body;

    const existing = await db
      .select()
      .from(workspaces)
      .where(eq(workspaces.id, id))
      .limit(1);

    if (!existing.length) {
      throw new NotFoundError(`Workspace with ID '${id}' not found`);
    }

    const updateData: Partial<typeof workspaces.$inferInsert> = {
      updatedAt: new Date(),
    };

    if (nameEn !== undefined) updateData.nameEn = nameEn;
    if (nameTe !== undefined) updateData.nameTe = nameTe;
    if (description !== undefined) updateData.description = description;
    if (icon !== undefined) updateData.icon = icon;
    if (displayOrder !== undefined) updateData.displayOrder = displayOrder;
    if (isActive !== undefined) updateData.isActive = Boolean(isActive);

    const [updated] = await db
      .update(workspaces)
      .set(updateData)
      .where(eq(workspaces.id, id))
      .returning();

    return res.status(200).json({
      success: true,
      workspace: updated,
    });
  });

  /**
   * DELETE /api/admin/workspaces/:id
   */
  static delete = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    const existing = await db
      .select()
      .from(workspaces)
      .where(eq(workspaces.id, id))
      .limit(1);

    if (!existing.length) {
      throw new NotFoundError(`Workspace with ID '${id}' not found`);
    }

    // Try hard delete, fallback to soft deactivate if referenced by foreign keys
    try {
      await db.delete(workspaces).where(eq(workspaces.id, id));
      return res.status(200).json({
        success: true,
        message: `Workspace '${id}' successfully deleted`,
      });
    } catch (err: any) {
      // If foreign key constraint prevents deletion, deactivate instead
      await db
        .update(workspaces)
        .set({ isActive: false, updatedAt: new Date() })
        .where(eq(workspaces.id, id));

      return res.status(200).json({
        success: true,
        message: `Workspace '${id}' is referenced by business categories, catalog items, or presets. It has been deactivated instead.`,
      });
    }
  });
}
