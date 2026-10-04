import { Request, Response } from "express";
import { db } from "../config";
import {
  catalogItems,
  businessCategories,
  wearTypes,
  catalogItemPresentations,
  catalogItemBackgrounds,
  catalogItemPoses,
} from "../config/schema";
import { eq, and, asc, sql, inArray } from "drizzle-orm";
import { asyncHandler, NotFoundError, BadRequestError } from "../utils";

export class CatalogController {
  /**
   * GET /api/admin/catalog
   * List catalog items with filters (workspace, genderTarget, businessCategoryId, wearType, search, isActive)
   * Includes linked presentationIds, backgroundIds (indoor + outdoor), and poseIds for each item.
   */
  static getAll = asyncHandler(async (req: Request, res: Response) => {
    const {
      workspace,
      genderTarget,
      businessCategoryId,
      wearType,
      wearTypeId,
      search,
      isActive,
      limit = "50",
      offset = "0",
    } = req.query as Record<string, string>;

    const effectiveWearType = wearType || wearTypeId;

    const conditions: any[] = [];
    if (workspace && workspace !== "all") {
      conditions.push(eq(catalogItems.workspace, workspace));
    }
    if (genderTarget && genderTarget !== "all") {
      conditions.push(eq(catalogItems.genderTarget, genderTarget));
    }
    if (businessCategoryId && businessCategoryId !== "all") {
      conditions.push(eq(catalogItems.businessCategoryId, businessCategoryId));
    }
    if (effectiveWearType && effectiveWearType !== "all") {
      conditions.push(eq(catalogItems.wearType, effectiveWearType));
    }
    if (isActive !== undefined) {
      conditions.push(eq(catalogItems.isActive, isActive === "true"));
    }
    if (search) {
      conditions.push(
        sql`(${catalogItems.nameEn} ILIKE ${`%${search}%`} OR ${catalogItems.nameTe} ILIKE ${`%${search}%`} OR ${catalogItems.id} ILIKE ${`%${search}%`})`
      );
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const rows = await db
      .select()
      .from(catalogItems)
      .where(whereClause)
      .orderBy(asc(catalogItems.displayOrder))
      .limit(Number(limit) || 50)
      .offset(Number(offset) || 0);

    const [countResult] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(catalogItems)
      .where(whereClause);

    const itemIds = rows.map((r) => r.id);
    const presMap: Record<string, string[]> = {};
    const bgMap: Record<string, string[]> = {};
    const poseMap: Record<string, string[]> = {};

    if (itemIds.length > 0) {
      const [allPres, allBgs, allPoses] = await Promise.all([
        db
          .select({
            catalogItemId: catalogItemPresentations.catalogItemId,
            presentationId: catalogItemPresentations.presentationId,
          })
          .from(catalogItemPresentations)
          .where(inArray(catalogItemPresentations.catalogItemId, itemIds))
          .orderBy(asc(catalogItemPresentations.displayOrder)),
        db
          .select({
            catalogItemId: catalogItemBackgrounds.catalogItemId,
            backgroundId: catalogItemBackgrounds.backgroundId,
          })
          .from(catalogItemBackgrounds)
          .where(inArray(catalogItemBackgrounds.catalogItemId, itemIds))
          .orderBy(asc(catalogItemBackgrounds.displayOrder)),
        db
          .select({
            catalogItemId: catalogItemPoses.catalogItemId,
            poseId: catalogItemPoses.poseId,
          })
          .from(catalogItemPoses)
          .where(inArray(catalogItemPoses.catalogItemId, itemIds))
          .orderBy(asc(catalogItemPoses.displayOrder)),
      ]);

      for (const p of allPres) {
        if (!presMap[p.catalogItemId]) presMap[p.catalogItemId] = [];
        presMap[p.catalogItemId].push(p.presentationId);
      }
      for (const b of allBgs) {
        if (!bgMap[b.catalogItemId]) bgMap[b.catalogItemId] = [];
        bgMap[b.catalogItemId].push(b.backgroundId);
      }
      for (const po of allPoses) {
        if (!poseMap[po.catalogItemId]) poseMap[po.catalogItemId] = [];
        poseMap[po.catalogItemId].push(po.poseId);
      }
    }

    const items = rows.map((r) => ({
      ...r,
      wearTypeId: r.wearType, // backward-compat alias
      presentationIds: presMap[r.id] || [],
      backgroundIds: bgMap[r.id] || [],
      poseIds: poseMap[r.id] || [],
    }));

    return res.status(200).json({
      success: true,
      items,
      total: countResult?.count || items.length,
    });
  });

  /**
   * GET /api/admin/catalog/:id
   * Returns single catalog item with its linked presentationIds, backgroundIds (indoor + outdoor), and poseIds.
   */
  static getById = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const [item] = await db.select().from(catalogItems).where(eq(catalogItems.id, id)).limit(1);

    if (!item) {
      throw new NotFoundError(`Catalog item with ID '${id}' not found.`, undefined, "CATALOG_ITEM_NOT_FOUND");
    }

    const [presList, bgList, poseList] = await Promise.all([
      db
        .select({ presentationId: catalogItemPresentations.presentationId })
        .from(catalogItemPresentations)
        .where(eq(catalogItemPresentations.catalogItemId, id))
        .orderBy(asc(catalogItemPresentations.displayOrder)),
      db
        .select({ backgroundId: catalogItemBackgrounds.backgroundId })
        .from(catalogItemBackgrounds)
        .where(eq(catalogItemBackgrounds.catalogItemId, id))
        .orderBy(asc(catalogItemBackgrounds.displayOrder)),
      db
        .select({ poseId: catalogItemPoses.poseId })
        .from(catalogItemPoses)
        .where(eq(catalogItemPoses.catalogItemId, id))
        .orderBy(asc(catalogItemPoses.displayOrder)),
    ]);

    return res.status(200).json({
      success: true,
      item: {
        ...item,
        wearTypeId: item.wearType,
        presentationIds: presList.map((p) => p.presentationId),
        backgroundIds: bgList.map((b) => b.backgroundId),
        poseIds: poseList.map((po) => po.poseId),
      },
    });
  });

  /**
   * POST /api/admin/catalog
   * Create new catalog item and link it to multiple presentations, backgrounds (indoor + outdoor), and poses.
   */
  static create = asyncHandler(async (req: Request, res: Response) => {
    const payload = req.body;
    let targetWorkspace = payload.workspace || "garment";

    // 1. When businessCategoryId is provided, ensure workspace matches business_categories.workspace
    if (payload.businessCategoryId) {
      const [biz] = await db
        .select()
        .from(businessCategories)
        .where(eq(businessCategories.id, payload.businessCategoryId))
        .limit(1);

      if (!biz) {
        throw new BadRequestError(`Business Category '${payload.businessCategoryId}' does not exist.`);
      }

      targetWorkspace = biz.workspace;
    }

    // 2. Validate wearType foreign key and composite workspace constraint
    let targetWearType = payload.wearType || payload.wearTypeId;
    if (!targetWearType) {
      targetWearType = targetWorkspace === "garment" ? "full_wear" : "other_wear";
    }

    const [wt] = await db
      .select()
      .from(wearTypes)
      .where(eq(wearTypes.id, targetWearType))
      .limit(1);

    if (!wt) {
      throw new BadRequestError(`Wear Type '${targetWearType}' does not exist.`);
    }

    if (wt.workspace !== targetWorkspace) {
      throw new BadRequestError(
        `Wear Type '${targetWearType}' belongs to workspace '${wt.workspace}', which does not match item workspace '${targetWorkspace}'.`
      );
    }

    const cleanId = payload.id.toLowerCase().replace(/[^a-z0-9_-]/g, "_");
    const { presentationIds, backgroundIds, poseIds } = payload;

    const [newItem] = await db
      .insert(catalogItems)
      .values({
        id: cleanId,
        businessCategoryId: payload.businessCategoryId || null,
        wearType: targetWearType,
        workspace: targetWorkspace,
        genderTarget: payload.genderTarget || "unisex",
        nameEn: payload.nameEn,
        nameTe: payload.nameTe,
        promptDirective: payload.promptDirective,
        placementDirective: payload.placementDirective || null,
        icon: payload.icon || null,
        sampleImageUrl: payload.sampleImageUrl || null,
        displayOrder: payload.displayOrder || 0,
        isActive: payload.isActive !== undefined ? payload.isActive : true,
        metadata: payload.metadata || {},
      })
      .returning();

    // Link presentations
    if (Array.isArray(presentationIds) && presentationIds.length > 0) {
      await db.insert(catalogItemPresentations).values(
        presentationIds.map((presId: string, idx: number) => ({
          catalogItemId: cleanId,
          presentationId: presId,
          displayOrder: idx,
        }))
      );
    }

    // Link backgrounds (indoor + outdoor)
    if (Array.isArray(backgroundIds) && backgroundIds.length > 0) {
      await db.insert(catalogItemBackgrounds).values(
        backgroundIds.map((bgId: string, idx: number) => ({
          catalogItemId: cleanId,
          backgroundId: bgId,
          displayOrder: idx,
        }))
      );
    }

    // Link poses
    if (Array.isArray(poseIds) && poseIds.length > 0) {
      await db.insert(catalogItemPoses).values(
        poseIds.map((poseId: string, idx: number) => ({
          catalogItemId: cleanId,
          poseId,
          displayOrder: idx,
        }))
      );
    }

    return res.status(201).json({
      success: true,
      item: {
        ...newItem,
        wearTypeId: newItem.wearType,
        presentationIds: presentationIds || [],
        backgroundIds: backgroundIds || [],
        poseIds: poseIds || [],
      },
    });
  });

  /**
   * PUT /api/admin/catalog/:id
   * Update catalog item and update its linked presentations, backgrounds, and poses.
   */
  static update = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const payload = req.body;

    const [existing] = await db.select().from(catalogItems).where(eq(catalogItems.id, id)).limit(1);
    if (!existing) {
      throw new NotFoundError(`Catalog item with ID '${id}' not found.`, undefined, "CATALOG_ITEM_NOT_FOUND");
    }

    let targetWorkspace = payload.workspace || existing.workspace;

    // 1. If businessCategoryId is provided or modified, synchronize workspace to maintain FK integrity
    const targetBusinessCatId = payload.businessCategoryId !== undefined ? payload.businessCategoryId : existing.businessCategoryId;
    if (targetBusinessCatId) {
      const [biz] = await db
        .select()
        .from(businessCategories)
        .where(eq(businessCategories.id, targetBusinessCatId))
        .limit(1);

      if (!biz) {
        throw new BadRequestError(`Business Category '${targetBusinessCatId}' does not exist.`);
      }

      targetWorkspace = biz.workspace;
    }

    // 2. Validate wearType foreign key and composite workspace constraint
    const targetWearType = payload.wearType !== undefined
      ? payload.wearType
      : (payload.wearTypeId !== undefined ? payload.wearTypeId : existing.wearType);

    if (targetWearType) {
      const [wt] = await db
        .select()
        .from(wearTypes)
        .where(eq(wearTypes.id, targetWearType))
        .limit(1);

      if (!wt) {
        throw new BadRequestError(`Wear Type '${targetWearType}' does not exist.`);
      }

      if (wt.workspace !== targetWorkspace) {
        throw new BadRequestError(
          `Wear Type '${targetWearType}' belongs to workspace '${wt.workspace}', which does not match item workspace '${targetWorkspace}'.`
        );
      }
    }

    const { categoryLabel, wearTypeId, presentationIds, backgroundIds, poseIds, ...cleanPayload } = payload;

    const updatePayload: any = {
      ...cleanPayload,
      wearType: targetWearType,
      workspace: targetWorkspace,
      updatedAt: new Date(),
    };

    const [updatedItem] = await db
      .update(catalogItems)
      .set(updatePayload)
      .where(eq(catalogItems.id, id))
      .returning();

    // Update presentation links if provided
    if (Array.isArray(presentationIds)) {
      await db.delete(catalogItemPresentations).where(eq(catalogItemPresentations.catalogItemId, id));
      if (presentationIds.length > 0) {
        await db.insert(catalogItemPresentations).values(
          presentationIds.map((presId: string, idx: number) => ({
            catalogItemId: id,
            presentationId: presId,
            displayOrder: idx,
          }))
        );
      }
    }

    // Update background links (indoor + outdoor) if provided
    if (Array.isArray(backgroundIds)) {
      await db.delete(catalogItemBackgrounds).where(eq(catalogItemBackgrounds.catalogItemId, id));
      if (backgroundIds.length > 0) {
        await db.insert(catalogItemBackgrounds).values(
          backgroundIds.map((bgId: string, idx: number) => ({
            catalogItemId: id,
            backgroundId: bgId,
            displayOrder: idx,
          }))
        );
      }
    }

    // Update pose links if provided
    if (Array.isArray(poseIds)) {
      await db.delete(catalogItemPoses).where(eq(catalogItemPoses.catalogItemId, id));
      if (poseIds.length > 0) {
        await db.insert(catalogItemPoses).values(
          poseIds.map((poseId: string, idx: number) => ({
            catalogItemId: id,
            poseId,
            displayOrder: idx,
          }))
        );
      }
    }

    const [finalPres, finalBgs, finalPoses] = await Promise.all([
      db
        .select({ presentationId: catalogItemPresentations.presentationId })
        .from(catalogItemPresentations)
        .where(eq(catalogItemPresentations.catalogItemId, id))
        .orderBy(asc(catalogItemPresentations.displayOrder)),
      db
        .select({ backgroundId: catalogItemBackgrounds.backgroundId })
        .from(catalogItemBackgrounds)
        .where(eq(catalogItemBackgrounds.catalogItemId, id))
        .orderBy(asc(catalogItemBackgrounds.displayOrder)),
      db
        .select({ poseId: catalogItemPoses.poseId })
        .from(catalogItemPoses)
        .where(eq(catalogItemPoses.catalogItemId, id))
        .orderBy(asc(catalogItemPoses.displayOrder)),
    ]);

    return res.status(200).json({
      success: true,
      item: {
        ...updatedItem,
        wearTypeId: updatedItem.wearType,
        presentationIds: finalPres.map((p) => p.presentationId),
        backgroundIds: finalBgs.map((b) => b.backgroundId),
        poseIds: finalPoses.map((po) => po.poseId),
      },
    });
  });

  /**
   * DELETE /api/admin/catalog/:id
   */
  static delete = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    // Explicitly delete junction records first (even with ON DELETE CASCADE, for safety)
    await Promise.all([
      db.delete(catalogItemPresentations).where(eq(catalogItemPresentations.catalogItemId, id)),
      db.delete(catalogItemBackgrounds).where(eq(catalogItemBackgrounds.catalogItemId, id)),
      db.delete(catalogItemPoses).where(eq(catalogItemPoses.catalogItemId, id)),
    ]);

    const [deletedItem] = await db.delete(catalogItems).where(eq(catalogItems.id, id)).returning();

    if (!deletedItem) {
      throw new NotFoundError(`Catalog item with ID '${id}' not found.`, undefined, "CATALOG_ITEM_NOT_FOUND");
    }

    return res.status(200).json({ success: true, message: `Catalog item '${id}' deleted successfully.` });
  });

  /**
   * PATCH /api/admin/catalog/:id/status
   */
  static toggleStatus = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { isActive } = req.body;

    const [updatedItem] = await db
      .update(catalogItems)
      .set({
        isActive: Boolean(isActive),
        updatedAt: new Date(),
      })
      .where(eq(catalogItems.id, id))
      .returning();

    if (!updatedItem) {
      throw new NotFoundError(`Catalog item with ID '${id}' not found.`, undefined, "CATALOG_ITEM_NOT_FOUND");
    }

    const [finalPres, finalBgs, finalPoses] = await Promise.all([
      db
        .select({ presentationId: catalogItemPresentations.presentationId })
        .from(catalogItemPresentations)
        .where(eq(catalogItemPresentations.catalogItemId, id))
        .orderBy(asc(catalogItemPresentations.displayOrder)),
      db
        .select({ backgroundId: catalogItemBackgrounds.backgroundId })
        .from(catalogItemBackgrounds)
        .where(eq(catalogItemBackgrounds.catalogItemId, id))
        .orderBy(asc(catalogItemBackgrounds.displayOrder)),
      db
        .select({ poseId: catalogItemPoses.poseId })
        .from(catalogItemPoses)
        .where(eq(catalogItemPoses.catalogItemId, id))
        .orderBy(asc(catalogItemPoses.displayOrder)),
    ]);

    return res.status(200).json({
      success: true,
      item: {
        ...updatedItem,
        wearTypeId: updatedItem.wearType,
        presentationIds: finalPres.map((p) => p.presentationId),
        backgroundIds: finalBgs.map((b) => b.backgroundId),
        poseIds: finalPoses.map((po) => po.poseId),
      },
    });
  });
}
