import { Request, Response } from "express";
import { db } from "../config";
import {
  businessCategories,
  catalogItems,
  faces,
  poses,
  presentations,
  backgrounds,
  systemSettings,
  systemLookups,
  genders,
  workspaces,
  wearTypes,
  catalogItemPresentations,
  catalogItemBackgrounds,
  catalogItemPoses,
} from "../config/schema";
import { eq, asc } from "drizzle-orm";
import { asyncHandler } from "../utils";

export class StudioController {
  /**
   * GET /api/studio/config
   * Returns complete active configuration for consumer photoshoot studio:
   * - Business Categories
   * - Catalog Items (Garments & Jewelry with prompt directives and linked presentations, backgrounds, poses)
   * - Studio Presets (Poses, Backgrounds, Model Faces with CDN URLs, Presentation Modes)
   * - System Lookups (Background Types: indoor/outdoor, Genders: male/female, Garments: top/bottom/full wear, Jewelry: neck/ear/wrist wear)
   * - System Settings (Pricing tiers, replication fidelity rules, negative exclusions)
   */
  static getConfig = asyncHandler(async (_req: Request, res: Response) => {
    // 1. Fetch active business categories ordered by displayOrder
    const businesses = await db
      .select()
      .from(businessCategories)
      .where(eq(businessCategories.isActive, true))
      .orderBy(asc(businessCategories.displayOrder));

    // 2. Fetch active catalog items and their linked presets ordered by displayOrder
    const [items, allItemPres, allItemBgs, allItemPoses] = await Promise.all([
      db
        .select()
        .from(catalogItems)
        .where(eq(catalogItems.isActive, true))
        .orderBy(asc(catalogItems.displayOrder)),
      db.select().from(catalogItemPresentations).orderBy(asc(catalogItemPresentations.displayOrder)),
      db.select().from(catalogItemBackgrounds).orderBy(asc(catalogItemBackgrounds.displayOrder)),
      db.select().from(catalogItemPoses).orderBy(asc(catalogItemPoses.displayOrder)),
    ]);

    const presMap: Record<string, string[]> = {};
    for (const p of allItemPres) {
      if (!presMap[p.catalogItemId]) presMap[p.catalogItemId] = [];
      presMap[p.catalogItemId].push(p.presentationId);
    }

    const bgMap: Record<string, string[]> = {};
    for (const b of allItemBgs) {
      if (!bgMap[b.catalogItemId]) bgMap[b.catalogItemId] = [];
      bgMap[b.catalogItemId].push(b.backgroundId);
    }

    const poseMap: Record<string, string[]> = {};
    for (const po of allItemPoses) {
      if (!poseMap[po.catalogItemId]) poseMap[po.catalogItemId] = [];
      poseMap[po.catalogItemId].push(po.poseId);
    }

    // 3. Fetch active presets from the 4 dedicated tables: faces, poses, presentations, backgrounds
    const [activeFaces, activePoses, activePresentations, activeBackgrounds] = await Promise.all([
      db.select().from(faces).where(eq(faces.isActive, true)).orderBy(asc(faces.displayOrder)),
      db.select().from(poses).where(eq(poses.isActive, true)).orderBy(asc(poses.displayOrder)),
      db.select().from(presentations).where(eq(presentations.isActive, true)).orderBy(asc(presentations.displayOrder)),
      db.select().from(backgrounds).where(eq(backgrounds.isActive, true)).orderBy(asc(backgrounds.displayOrder)),
    ]);

    const typedFaces = activeFaces.map((f) => ({ ...f, type: "face" as const }));
    const typedPoses = activePoses.map((p) => ({ ...p, type: "pose" as const }));
    const typedPresentations = activePresentations.map((pr) => ({ ...pr, type: "presentation" as const }));
    const typedBackgrounds = activeBackgrounds.map((b) => ({ ...b, type: "background" as const }));

    const groupedPresets = {
      poses: typedPoses,
      backgrounds: typedBackgrounds,
      faces: typedFaces,
      presentationModes: typedPresentations,
      presentations: typedPresentations,
      styles: [],
    };

    // 4. Fetch system settings
    const settingsList = await db.select().from(systemSettings);
    const settingsMap = settingsList.reduce((acc, curr) => {
      acc[curr.key] = curr.value;
      return acc;
    }, {} as Record<string, any>);

    const pricing = settingsMap["pricing_rules"] || {
      resolutionTiers: { "1k": 1, "2k": 2, "4k": 4 },
      freeSignupCredits: 10,
    };
    const fidelityRules = settingsMap["fidelity_directives"]?.mandatory_replications || [];
    const negativeExclusions = settingsMap["negative_exclusions"]?.prohibitions || [];

    // 5. Fetch active wear types from dedicated wear_types table
    const allWearTypes = await db
      .select()
      .from(wearTypes)
      .where(eq(wearTypes.isActive, true))
      .orderBy(asc(wearTypes.displayOrder));

    // 6. Fetch active system lookups (background types, genders)
    const allLookups = await db
      .select()
      .from(systemLookups)
      .where(eq(systemLookups.isActive, true))
      .orderBy(asc(systemLookups.displayOrder));

    const lookups = {
      backgroundTypes: allLookups.filter((l) => l.type === "background_type"),
      genders: allLookups.filter((l) => l.type === "gender"),
      garmentCategories: allWearTypes.filter((w) => w.workspace === "garment"),
      jewelryCategories: allWearTypes.filter((w) => w.workspace === "jewelry"),
      all: allLookups,
    };

    // 7. Fetch active genders from genders lookup table
    const allGenders = await db
      .select()
      .from(genders)
      .where(eq(genders.isActive, true))
      .orderBy(asc(genders.displayOrder));

    // 8. Fetch active workspaces lookup
    const allWorkspaces = await db
      .select()
      .from(workspaces)
      .where(eq(workspaces.isActive, true))
      .orderBy(asc(workspaces.displayOrder));

    // Cache-Control header: no-cache, must-revalidate to ensure instant admin dashboard updates in studio
    res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");

    return res.status(200).json({
      success: true,
      businesses,
      categories: businesses,
      catalogItems: items.map((i) => ({
        ...i,
        wearTypeId: i.wearType,
        thumbnailUrl: i.sampleImageUrl || (i as any).thumbnailUrl || null,
        presentationIds: presMap[i.id] || [],
        backgroundIds: bgMap[i.id] || [],
        poseIds: poseMap[i.id] || [],
      })),
      presets: groupedPresets,
      faces: typedFaces,
      poses: typedPoses,
      presentations: typedPresentations,
      backgrounds: typedBackgrounds,
      lookups,
      genders: allGenders,
      workspaces: allWorkspaces,
      wearTypes: allWearTypes,
      settings: settingsMap,
      optionMappings: settingsMap["option_mappings"] || null,
      heroSlides: settingsMap["hero_slides"] || [],
      presetColors: settingsMap["preset_colors"] || [],
      pricingMatrix: settingsMap["pricing_matrix"] || null,
      imageModels: settingsMap["image_models"] || [],
      imageResolutions: settingsMap["image_resolutions"] || [],
      translations: {
        en: settingsMap["ui_translations_en"] || null,
        te: settingsMap["ui_translations_te"] || null,
      },
      systemSettings: {
        pricing,
        fidelityRules,
        negativeExclusions,
        fidelityDirectives: settingsMap["fidelity_directives"] || null,
        faceMatchingRules: settingsMap["face_matching_rules"] || null,
      },
    });
  });
}
