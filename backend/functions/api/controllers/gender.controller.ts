import { Request, Response } from "express";
import { db } from "../config";
import { genders } from "../config/schema";
import { eq, asc } from "drizzle-orm";
import { asyncHandler } from "../utils";
import { NotFoundError, BadRequestError } from "../utils/errors";

export class GenderController {
  /**
   * GET /api/studio/genders or /api/genders
   * Returns active genders ordered by displayOrder
   */
  static getAll = asyncHandler(async (_req: Request, res: Response) => {
    const list = await db
      .select()
      .from(genders)
      .where(eq(genders.isActive, true))
      .orderBy(asc(genders.displayOrder));

    res.setHeader("Cache-Control", "public, max-age=60, stale-while-revalidate=300");

    return res.status(200).json({
      success: true,
      genders: list,
    });
  });

  /**
   * GET /api/admin/genders
   * Admin endpoint to list all genders with optional isActive query filter
   */
  static getAllAdmin = asyncHandler(async (req: Request, res: Response) => {
    const { isActive } = req.query as { isActive?: string };

    const query = db.select().from(genders);
    if (isActive !== undefined) {
      query.where(eq(genders.isActive, isActive === "true"));
    }

    const list = await query.orderBy(asc(genders.displayOrder));

    return res.status(200).json({
      success: true,
      genders: list,
    });
  });

  /**
   * GET /api/admin/genders/:id
   */
  static getById = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    const list = await db
      .select()
      .from(genders)
      .where(eq(genders.id, id))
      .limit(1);

    if (!list.length) {
      throw new NotFoundError(`Gender with ID '${id}' not found`);
    }

    return res.status(200).json({
      success: true,
      gender: list[0],
    });
  });

  /**
   * POST /api/admin/genders
   */
  static create = asyncHandler(async (req: Request, res: Response) => {
    const { id, code, nameEn, nameTe, description, icon, displayOrder, isActive } = req.body;

    if (!id || !code || !nameEn || !nameTe) {
      throw new BadRequestError("id, code, nameEn, and nameTe are required");
    }

    const existing = await db
      .select()
      .from(genders)
      .where(eq(genders.id, id))
      .limit(1);

    if (existing.length > 0) {
      throw new BadRequestError(`Gender with ID '${id}' already exists`);
    }

    const [created] = await db
      .insert(genders)
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
      gender: created,
    });
  });

  /**
   * PUT /api/admin/genders/:id
   */
  static update = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { nameEn, nameTe, description, icon, displayOrder, isActive } = req.body;

    const existing = await db
      .select()
      .from(genders)
      .where(eq(genders.id, id))
      .limit(1);

    if (!existing.length) {
      throw new NotFoundError(`Gender with ID '${id}' not found`);
    }

    const updateData: Partial<typeof genders.$inferInsert> = {
      updatedAt: new Date(),
    };

    if (nameEn !== undefined) updateData.nameEn = nameEn;
    if (nameTe !== undefined) updateData.nameTe = nameTe;
    if (description !== undefined) updateData.description = description;
    if (icon !== undefined) updateData.icon = icon;
    if (displayOrder !== undefined) updateData.displayOrder = displayOrder;
    if (isActive !== undefined) updateData.isActive = Boolean(isActive);

    const [updated] = await db
      .update(genders)
      .set(updateData)
      .where(eq(genders.id, id))
      .returning();

    return res.status(200).json({
      success: true,
      gender: updated,
    });
  });

  /**
   * DELETE /api/admin/genders/:id
   */
  static delete = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    const existing = await db
      .select()
      .from(genders)
      .where(eq(genders.id, id))
      .limit(1);

    if (!existing.length) {
      throw new NotFoundError(`Gender with ID '${id}' not found`);
    }

    // Try hard delete, fallback to soft deactivate if referenced by foreign keys
    try {
      await db.delete(genders).where(eq(genders.id, id));
      return res.status(200).json({
        success: true,
        message: `Gender '${id}' successfully deleted`,
      });
    } catch (err: any) {
      // If foreign key constraint prevents deletion, deactivate instead
      await db
        .update(genders)
        .set({ isActive: false, updatedAt: new Date() })
        .where(eq(genders.id, id));

      return res.status(200).json({
        success: true,
        message: `Gender '${id}' is referenced by active records. It has been deactivated instead.`,
      });
    }
  });
}
