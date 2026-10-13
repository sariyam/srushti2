import multer from "multer";
import { Request } from "express";

// In-memory storage is required for serverless environments (AWS Lambda, Vercel)
const storage = multer.memoryStorage();

const allowedMimeTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];

function fileFilter(req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) {
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only JPEG, PNG, and WebP image formats are allowed."));
  }
}

export const avatarUploadMiddleware = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB maximum
    files: 1,
  },
  fileFilter,
}).single("avatar");
