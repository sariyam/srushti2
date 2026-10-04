import { Request, Response } from "express";
import { db } from "../config";
import { businessCategories } from "../config/schema";
import { eq, asc } from "drizzle-orm";
import { asyncHandler, NotFoundError } from "../utils";

export class BusinessController {
  /**
   * GET /api/admin/businesses
   */
  static getAll = asyncHandler(async (_req: Request, res: Response) => {
    const categories = await db
      .select()
      .from(businessCategories)
      .orderBy(asc(businessCategories.displayOrder));

    return res.status(200).json({ success: true, categories });
  });

  /**
   * GET /api/admin/businesses/:id
   */
  static getById = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const [category] = await db
      .select()
      .from(businessCategories)
      .where(eq(businessCategories.id, id))
      .limit(1);

    if (!category) {
      throw new NotFoundError(`Business category with ID '${id}' not found.`, undefined, "BUSINESS_CATEGORY_NOT_FOUND");
    }

    return res.status(200).json({ success: true, category });
  });

  /**
   * POST /api/admin/businesses
   */
  static create = asyncHandler(async (req: Request, res: Response) => {
    const payload = req.body;
    const [newCategory] = await db
      .insert(businessCategories)
      .values({
        id: payload.id.toLowerCase().replace(/[^a-z0-9_-]/g, "_"),
        workspace: payload.workspace || "garment",
        genderTarget: payload.genderTarget || "all",
        nameEn: payload.nameEn,
        nameTe: payload.nameTe,
        icon: payload.icon,
        bannerUrl: payload.bannerUrl,
        displayOrder: payload.displayOrder || 0,
        isActive: payload.isActive !== undefined ? payload.isActive : true,
        metadata: payload.metadata || {},
      })
      .returning();

    return res.status(201).json({ success: true, category: newCategory });
  });

  /**
   * PUT /api/admin/businesses/:id
   */
  static update = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const payload = req.body;

    const [updatedCategory] = await db
      .update(businessCategories)
      .set({
        ...payload,
        updatedAt: new Date(),
      })
      .where(eq(businessCategories.id, id))
      .returning();

    if (!updatedCategory) {
      throw new NotFoundError(`Business category with ID '${id}' not found.`, undefined, "BUSINESS_CATEGORY_NOT_FOUND");
    }

    return res.status(200).json({ success: true, category: updatedCategory });
  });

  /**
   * DELETE /api/admin/businesses/:id
   */
  static delete = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const [deletedCategory] = await db
      .delete(businessCategories)
      .where(eq(businessCategories.id, id))
      .returning();

    if (!deletedCategory) {
      throw new NotFoundError(`Business category with ID '${id}' not found.`, undefined, "BUSINESS_CATEGORY_NOT_FOUND");
    }

    return res.status(200).json({ success: true, message: `Business category '${id}' deleted successfully.` });
  });
}
