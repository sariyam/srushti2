import { Request, Response } from "express";
import { db } from "../config";
import { systemLookups, wearTypes } from "../config/schema";
import { eq, asc, and } from "drizzle-orm";
import { asyncHandler } from "../utils";
import { NotFoundError, BadRequestError } from "../utils/errors";

export class LookupController {
  /**
   * GET /api/lookups or /api/studio/lookups
   * Returns active system lookups grouped by category:
   * - backgroundTypes (indoor, outdoor)
   * - genders (female, male)
   * - garmentCategories (top_wear, bottom_wear, full_wear sourced from wear_types)
   * - jewelryCategories (neck_wear, ear_wear, wrist_wear, etc. sourced from wear_types)
   */
  static getGrouped = asyncHandler(async (_req: Request, res: Response) => {
    const allLookups = await db
      .select()
      .from(systemLookups)
      .where(eq(systemLookups.isActive, true))
      .orderBy(asc(systemLookups.displayOrder));

    const allWearTypes = await db
      .select()
      .from(wearTypes)
      .where(eq(wearTypes.isActive, true))
      .orderBy(asc(wearTypes.displayOrder));

    const backgroundTypes = allLookups.filter((l) => l.type === "background_type");
    const genders = allLookups.filter((l) => l.type === "gender");
    const garmentCategories = allWearTypes
      .filter((w) => w.workspace === "garment")
      .map((w) => ({ ...w, type: "garment_category" as const }));
    const jewelryCategories = allWearTypes
      .filter((w) => w.workspace === "jewelry")
      .map((w) => ({ ...w, type: "jewelry_category" as const }));

    // Cache-Control: public 60s, stale-while-revalidate 300s
    res.setHeader("Cache-Control", "public, max-age=60, stale-while-revalidate=300");

    return res.status(200).json({
      success: true,
      lookups: {
        backgroundTypes,
        genders,
        garmentCategories,
        jewelryCategories,
        all: allLookups,
      },
    });
  });

  /**
   * GET /api/admin/lookups
   * Admin endpoint to list all lookups with optional query filters
   */
  static getAllAdmin = asyncHandler(async (req: Request, res: Response) => {
    const { type, isActive } = req.query as { type?: string; isActive?: string };

    const conditions = [];
    if (type) {
      conditions.push(eq(systemLookups.type, type as any));
    }
    if (isActive !== undefined) {
      conditions.push(eq(systemLookups.isActive, isActive === "true"));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const list = await db
      .select()
      .from(systemLookups)
      .where(whereClause)
      .orderBy(asc(systemLookups.type), asc(systemLookups.displayOrder));

    return res.status(200).json({
      success: true,
      lookups: list,
    });
  });

  /**
   * POST /api/admin/lookups
   * Admin endpoint to create a new system lookup
   */
  static create = asyncHandler(async (req: Request, res: Response) => {
    const { id, type, code, nameEn, nameTe, description, icon, displayOrder, isActive, metadata } = req.body;

    const existing = await db
      .select()
      .from(systemLookups)
      .where(eq(systemLookups.id, id))
      .limit(1);

    if (existing.length > 0) {
      throw new BadRequestError(`Lookup with ID '${id}' already exists.`);
    }

    const [created] = await db
      .insert(systemLookups)
      .values({
        id,
        type,
        code,
        nameEn,
        nameTe,
        description: description || null,
        icon: icon || null,
        displayOrder: displayOrder ?? 0,
        isActive: isActive !== undefined ? isActive : true,
        metadata: metadata || {},
      })
      .returning();

    return res.status(201).json({
      success: true,
      lookup: created,
    });
  });

  /**
   * PUT /api/admin/lookups/:id
   * Admin endpoint to update an existing system lookup
   */
  static update = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { nameEn, nameTe, description, icon, displayOrder, isActive, metadata } = req.body;

    const existing = await db
      .select()
      .from(systemLookups)
      .where(eq(systemLookups.id, id))
      .limit(1);

    if (existing.length === 0) {
      throw new NotFoundError(`Lookup with ID '${id}' not found.`);
    }

    const updateData: Partial<typeof systemLookups.$inferInsert> = {
      updatedAt: new Date(),
    };

    if (nameEn !== undefined) updateData.nameEn = nameEn;
    if (nameTe !== undefined) updateData.nameTe = nameTe;
    if (description !== undefined) updateData.description = description;
    if (icon !== undefined) updateData.icon = icon;
    if (displayOrder !== undefined) updateData.displayOrder = displayOrder;
    if (isActive !== undefined) updateData.isActive = isActive;
    if (metadata !== undefined) updateData.metadata = metadata;

    const [updated] = await db
      .update(systemLookups)
      .set(updateData)
      .where(eq(systemLookups.id, id))
      .returning();

    return res.status(200).json({
      success: true,
      lookup: updated,
    });
  });

  /**
   * DELETE /api/admin/lookups/:id
   * Admin endpoint to delete a system lookup
   */
  static delete = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    const existing = await db
      .select()
      .from(systemLookups)
      .where(eq(systemLookups.id, id))
      .limit(1);

    if (existing.length === 0) {
      throw new NotFoundError(`Lookup with ID '${id}' not found.`);
    }

    await db.delete(systemLookups).where(eq(systemLookups.id, id));

    return res.status(200).json({
      success: true,
      message: `Lookup '${id}' deleted successfully.`,
    });
  });
}
