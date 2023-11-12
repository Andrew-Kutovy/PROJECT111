import { NextFunction, Request, Response } from "express";
import { UploadedFile } from "express-fileupload";

import { photoConfig } from "../configs/file.config";
import { ApiError } from "../errors/api.error";

class FilesMiddleware {
  public async isPhotoValid(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { size, mimetype } = req.files.photo as UploadedFile;
      if (size > photoConfig.MAX_SIZE) {
        throw new ApiError("Size of photo is too big", 400);
      }
      if (!photoConfig.MIMETYPES.includes(mimetype)) {
        throw new ApiError("File has invalid format", 400);
      }

      next();
    } catch (e) {
      next(e);
    }
  }
}

export const filesMiddleware = new FilesMiddleware();
