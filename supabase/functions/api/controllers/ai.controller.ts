import { Request, Response } from "express";
import { AiService } from "../services/ai.service";
import { UnauthorizedError, asyncHandler } from "../utils";
export { generateAiImageSchema, GenerateAiImageSchema } from "../schemas/ai.schema";

export class AiController {
  static generate = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
      throw new UnauthorizedError("Authentication required to generate AI photos");
    }

    const result = await AiService.generateImage({
      userId: req.user.userId,
      ...req.body,
    });

    return res.status(200).json({
      success: true,
      ...result,
    });
  });
}
