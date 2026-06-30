import { Router } from "express";
import * as userService from "./user.service.js";
import {
  authentication,
  authorization,
} from "../../Middleware/authentication.middleware.js";
import { RoleEnum, TokenTypeEnum } from "../../Utils/enums/user.enum.js";
import { fileValidation, localFileUpload } from "../../Utils/multer/local.multer.js";
import { fileMagicValidation } from "../../Middleware/mime.authentication.js";
const router = Router();

router.get(
  "/profile",
  authentication({ tokenType: TokenTypeEnum.Access }),
  authorization({ accessRole: [RoleEnum.ADMIN] }),
  userService.getProfile,
);

router.patch(
  "/upload-file",
  authentication({ tokenType: TokenTypeEnum.Access }),
  authorization({ accessRole: [RoleEnum.USER] }),
  localFileUpload({costumPath: "usrs", validation:fileValidation.documents}).array("attachments", 2),
  userService.updateProfilePic,
);

router.patch(
  "/cover-upload-file",
  authentication({ tokenType: TokenTypeEnum.Access }),
  authorization({ accessRole: [RoleEnum.USER] }),
  localFileUpload({costumPath: "usrs", validation:fileValidation.images}).array("attachments", 2),
  fileMagicValidation,
  userService.updateProfilePic,
);

export default router;
