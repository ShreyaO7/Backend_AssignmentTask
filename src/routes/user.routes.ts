import { Router } from "express";
import * as userController from "../controllers/user.controller";
import validateRequest from "../middlewares/validateRequest";
import { createUserSchema, userIdParamSchema } from "../validators/user.validator";

const router = Router();

router.post("/", validateRequest(createUserSchema), userController.createUser);
router.get("/:id/sessions", validateRequest(userIdParamSchema), userController.getUserSessions);

export default router;
