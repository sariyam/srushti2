import { Request, Response } from "express";
import { db } from "../config";
import { systemSettings } from "../config/schema";
import { eq } from "drizzle-orm";
import { asyncHandler, NotFoundError } from "../utils";

export class SettingsController {
  /**
   * GET /api/admin/settings
   */
  static getAll = asyncHandler(async (_req: Request, res: Response) => {
    const settings = await db.select().from(systemSettings);
    return res.status(200).json({ success: true, settings });
  });

  /**
   * GET /api/admin/settings/:key
   */
  static getByKey = asyncHandler(async (req: Request, res: Response) => {
    const { key } = req.params;
    const [setting] = await db
      .select()
      .from(systemSettings)
      .where(eq(systemSettings.key, key))
      .limit(1);

    if (!setting) {
      throw new NotFoundError(`System setting with key '${key}' not found.`, undefined, "SETTING_NOT_FOUND");
    }

    return res.status(200).json({ success: true, setting });
  });

  /**
   * PUT /api/admin/settings/:key
   */
  static updateByKey = asyncHandler(async (req: Request, res: Response) => {
    const { key } = req.params;
    const { value, description, category } = req.body;

    const [updatedSetting] = await db
      .insert(systemSettings)
      .values({
        key,
        category: category || "general",
        value,
        description,
        updatedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: systemSettings.key,
        set: {
          value,
          description: description !== undefined ? description : undefined,
          updatedAt: new Date(),
        },
      })
      .returning();

    return res.status(200).json({
      success: true,
      message: `System setting '${key}' updated successfully.`,
      setting: updatedSetting,
    });
  });
}
