import { fileTypeFromBuffer } from "file-type";
import fs from "fs";
import { fileValidation } from "../Utils/multer/local.multer.js";
import { BadRequestException } from "../Utils/response/error.response.js";

export const fileMagicValidation = async (req, res, next) => {
  try {
    const filePath = req.file.path;
    const buffer = fs.readFileSync(filePath);
    const type = await fileTypeFromBuffer(buffer);
    const allowedTypes = [
      "image/png",
      "image/jpg",
      "image/gif",
      "image/jpeg",
      "image/pjpeg",
    ];
    if (!type || !allowedTypes.includes(type.mime))
      return next(new Error("invalid file type"));
  } catch (error) {
    BadRequestException("Internal server error");
  }
};
