import multer from "multer";
import path from "node:path";
import fs from "node:fs";

export const fileValidation = {
  images: ["image/png", "image/jpg", "image/gif", "image/jpeg", "image/pjpeg"],
  videos: ["video/mp4", "video/jpeg", "video/mpeg"],
  audios: ["audio/mp3"],
  documents: [
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ],
};

export const localFileUpload = ({
  costumPath = "general",
  validation = [],
}) => {
  const basePath = `uploads/${costumPath}`;

  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      let userBasePath = basePath;
      if (req.user?._id) userBasePath += `/${req.user._id}`;

      const fullPath = path.resolve(`./src/${userBasePath}`);

      if (!fs.existsSync(fullPath)) fs.mkdirSync(fullPath, { recursive: true });

      cb(null, path.resolve(fullPath));
    },

    filename: (req, file, cb) => {
      const uniqueFileName =
        Date.now() +
        "-" +
        Math.round(Math.random() * 1e9) +
        "-" +
        file.originalname;
      file.finalPath = `${basePath}/${req.user._id}/${uniqueFileName}`;

      cb(null, uniqueFileName);
    },
  });

  const fileFilter = (req, file, cb) => {
    if (validation.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type"), false);
    }
  };
  return multer({ fileFilter, storage });
};
