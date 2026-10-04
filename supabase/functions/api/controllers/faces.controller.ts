import { Request, Response } from "express";
import multer from "multer";
import path from "node:path";
import fs from "node:fs";
import { db, env } from "../config";
import { faces } from "../config/schema";
import { eq, and, asc, sql } from "drizzle-orm";
import { asyncHandler, BadRequestError, NotFoundError } from "../utils";
import { createClient } from "@supabase/supabase-js";

// Memory storage upload middleware for model face portraits (10MB max)
export const faceUploadMiddleware = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new BadRequestError("Only JPEG, PNG, and WebP images are allowed for model faces."));
    }
  },
});

export class FacesController {
  /**
   * Helper to get Supabase Client for Storage
   */
  private static getSupabaseStorage() {
    if (env.SUPABASE_URL && env.SUPABASE_SERVICE_ROLE_KEY && env.SUPABASE_SERVICE_ROLE_KEY !== "your-supabase-service-role-key") {
      return createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
        auth: { persistSession: false },
      });
    }
    return null;
  }

  /**
   * GET /api/admin/faces
   * List all faces with optional workspace, genderTarget, isActive filtering
   */
  static getAll = asyncHandler(async (req: Request, res: Response) => {
    const { workspace, genderTarget, wearTypeId, isActive, limit = "100", offset = "0" } = req.query as Record<string, string>;

    const conditions: any[] = [];
    if (workspace && ["garment", "jewelry", "all"].includes(workspace)) {
      conditions.push(eq(faces.workspace, workspace as any));
    }
    if (genderTarget) {
      conditions.push(eq(faces.genderTarget, genderTarget));
    }
    if (wearTypeId) {
      conditions.push(eq(faces.wearTypeId, wearTypeId));
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

    const [countResult] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(faces)
      .where(whereClause);

    return res.status(200).json({
      success: true,
      faces: items,
      total: countResult?.count || items.length,
    });
  });

  /**
   * GET /api/admin/faces/:id
   */
  static getById = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const [face] = await db.select().from(faces).where(eq(faces.id, id)).limit(1);

    if (!face) {
      throw new NotFoundError(`Model face with ID '${id}' not found.`, undefined, "FACE_NOT_FOUND");
    }

    return res.status(200).json({ success: true, face });
  });

  /**
   * POST /api/admin/faces
   */
  static create = asyncHandler(async (req: Request, res: Response) => {
    const payload = req.body;
    const id = (payload.id || payload.nameEn).toLowerCase().replace(/[^a-z0-9_-]/g, "_");

    const [newFace] = await db
      .insert(faces)
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

    return res.status(201).json({ success: true, face: newFace });
  });

  /**
   * PUT /api/admin/faces/:id
   */
  static update = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const payload = req.body;

    const [updatedFace] = await db
      .update(faces)
      .set({
        ...payload,
        updatedAt: new Date(),
      })
      .where(eq(faces.id, id))
      .returning();

    if (!updatedFace) {
      throw new NotFoundError(`Model face with ID '${id}' not found.`, undefined, "FACE_NOT_FOUND");
    }

    return res.status(200).json({ success: true, face: updatedFace });
  });

  /**
   * PATCH /api/admin/faces/:id/status
   */
  static toggleStatus = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { isActive } = req.body;

    const [updated] = await db
      .update(faces)
      .set({
        isActive: Boolean(isActive),
        updatedAt: new Date(),
      })
      .where(eq(faces.id, id))
      .returning();

    if (!updated) {
      throw new NotFoundError(`Model face with ID '${id}' not found.`, undefined, "FACE_NOT_FOUND");
    }

    return res.status(200).json({ success: true, face: updated });
  });

  /**
   * POST /api/admin/faces/upload
   * Uploads high-res model headshot to Supabase Storage 'model-faces' bucket
   * and creates/updates a faces record
   */
  static uploadFace = asyncHandler(async (req: Request, res: Response) => {
    const file = req.file;
    if (!file) {
      throw new BadRequestError("Image file is required for model face upload.");
    }

    const { id, nameEn, nameTe, promptDirective, gender = "female", ethnicity = "indian", displayOrder = "0" } = req.body;

    if (!nameEn || !promptDirective) {
      throw new BadRequestError("nameEn and promptDirective are required fields.");
    }

    const faceId = (id || nameEn.toLowerCase().replace(/[^a-z0-9_-]/g, "_")).trim();
    const ext = path.extname(file.originalname).toLowerCase() || ".jpg";
    const fileName = `${faceId}${ext}`;
    const storagePath = `model-faces/${fileName}`;

    // 1. Upload to Supabase Storage if configured
    let previewImageUrl = `https://xfooqaqjeaqcoddihphl.supabase.co/storage/v1/object/public/model-faces/${fileName}`;
    const supabase = FacesController.getSupabaseStorage();

    if (supabase) {
      const { error: uploadError } = await supabase.storage
        .from("model-faces")
        .upload(fileName, file.buffer, {
          contentType: file.mimetype,
          upsert: true,
        });

      if (uploadError) {
        console.error("Supabase Storage upload warning:", uploadError.message);
      }
    }

    // 2. Also save to local public/faces directory for seamless offline/local dev support
    try {
      const localFacesDir = path.resolve(process.cwd(), "../public/faces");
      if (fs.existsSync(localFacesDir)) {
        fs.writeFileSync(path.join(localFacesDir, fileName), file.buffer);
      }
    } catch (_err) {
      // Ignore local write failure in read-only container environments
    }

    // 3. Upsert record into faces table
    const [faceRecord] = await db
      .insert(faces)
      .values({
        id: faceId,
        workspace: "all",
        genderTarget: gender === "male" ? "male" : "female",
        wearTypeId: null,
        subCategory: ethnicity || "indian",
        nameEn,
        nameTe: nameTe || nameEn,
        promptDirective,
        previewImageUrl,
        storagePath,
        thumbnailUrl: null,
        displayOrder: Number(displayOrder) || 0,
        isActive: true,
        metadata: { gender, ethnicity },
      })
      .onConflictDoUpdate({
        target: faces.id,
        set: {
          genderTarget: gender === "male" ? "male" : "female",
          subCategory: ethnicity || "indian",
          nameEn,
          nameTe: nameTe || nameEn,
          promptDirective,
          previewImageUrl,
          storagePath,
          displayOrder: Number(displayOrder) || 0,
          isActive: true,
          metadata: { gender, ethnicity },
          updatedAt: new Date(),
        },
      })
      .returning();

    const formattedFace = { ...faceRecord, type: "face" as const };
    return res.status(201).json({
      success: true,
      message: `Model face '${nameEn}' uploaded successfully.`,
      preset: formattedFace,
      face: formattedFace,
    });
  });

  /**
   * PUT /api/admin/faces/:id/replace
   * Replaces the photo image of an existing model face
   */
  static replacePhoto = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const file = req.file;

    if (!file) {
      throw new BadRequestError("Image file is required to replace face photo.");
    }

    const [existing] = await db.select().from(faces).where(eq(faces.id, id)).limit(1);
    if (!existing) {
      throw new NotFoundError(`Model face with ID '${id}' not found.`, undefined, "FACE_NOT_FOUND");
    }

    const ext = path.extname(file.originalname).toLowerCase() || ".jpg";
    const fileName = `${id}${ext}`;
    const storagePath = `model-faces/${fileName}`;
    const previewImageUrl = `https://xfooqaqjeaqcoddihphl.supabase.co/storage/v1/object/public/model-faces/${fileName}?t=${Date.now()}`;

    // Upload to Supabase Storage
    const supabase = FacesController.getSupabaseStorage();
    if (supabase) {
      await supabase.storage
        .from("model-faces")
        .upload(fileName, file.buffer, {
          contentType: file.mimetype,
          upsert: true,
        });
    }

    // Save locally if folder exists
    try {
      const localFacesDir = path.resolve(process.cwd(), "../public/faces");
      if (fs.existsSync(localFacesDir)) {
        fs.writeFileSync(path.join(localFacesDir, fileName), file.buffer);
      }
    } catch (_err) {
      // Ignore
    }

    // Update face record
    const [updated] = await db
      .update(faces)
      .set({
        previewImageUrl,
        storagePath,
        updatedAt: new Date(),
      })
      .where(eq(faces.id, id))
      .returning();

    const formattedFace = { ...updated, type: "face" as const };
    return res.status(200).json({
      success: true,
      message: `Model photo for '${id}' replaced successfully.`,
      preset: formattedFace,
      face: formattedFace,
    });
  });

  /**
   * DELETE /api/admin/faces/:id
   */
  static deleteFace = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    const [existing] = await db.select().from(faces).where(eq(faces.id, id)).limit(1);
    if (!existing) {
      throw new NotFoundError(`Model face with ID '${id}' not found.`, undefined, "FACE_NOT_FOUND");
    }

    // Delete from Supabase Storage
    const supabase = FacesController.getSupabaseStorage();
    if (supabase && existing.storagePath) {
      const filename = path.basename(existing.storagePath);
      await supabase.storage.from("model-faces").remove([filename]);
    }

    // Delete DB record
    await db.delete(faces).where(eq(faces.id, id));

    return res.status(200).json({
      success: true,
      message: `Model face '${id}' deleted successfully from database and storage.`,
    });
  });
}
