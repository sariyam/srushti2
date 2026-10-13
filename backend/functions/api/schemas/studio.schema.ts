import { z } from "@hono/zod-openapi";
import { BusinessCategoryModel } from "./business.schema";
import { CatalogItemModel } from "./catalog.schema";
import { StudioPresetModel } from "./preset.schema";

import { GroupedLookupsResponseSchema } from "./lookup.schema";
import { GenderModel } from "./gender.schema";
import { WorkspaceModel } from "./workspace.schema";

export const StudioConfigResponseSchema = z
  .object({
    success: z.boolean().openapi({ example: true }),
    businesses: z.array(BusinessCategoryModel),
    catalogItems: z.array(CatalogItemModel),
    presets: z.object({
      poses: z.array(StudioPresetModel),
      backgrounds: z.array(StudioPresetModel),
      faces: z.array(StudioPresetModel),
      presentationModes: z.array(StudioPresetModel),
      styles: z.array(StudioPresetModel),
    }),
    lookups: GroupedLookupsResponseSchema.shape.lookups.optional(),
    genders: z.array(GenderModel).optional(),
    workspaces: z.array(WorkspaceModel).optional(),
    systemSettings: z.object({
      pricing: z.record(z.any()),
      fidelityRules: z.array(z.string()).optional(),
      negativeExclusions: z.array(z.string()).optional(),
    }),
  })
  .openapi("StudioConfigResponse");

export type StudioConfigResponse = z.infer<typeof StudioConfigResponseSchema>;
