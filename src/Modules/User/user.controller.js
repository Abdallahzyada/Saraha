import { Router } from "express";
import * as userService from "./user.service.js";
import { authentication } from "../../Middleware/authentication.middleware.js";
import { TokenTypeEnum } from "../../Utils/enums/user.enum.js";
const router = Router();

router.get("/profile", 
    authentication({tokenType: TokenTypeEnum.Access}), 
    userService.getProfile);

export default router;