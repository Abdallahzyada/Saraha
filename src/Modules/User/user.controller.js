import { Router } from "express";
import * as userService from "./user.service.js";
const router = Router();

router.get("/profile", userService.getProfile);

export default router;