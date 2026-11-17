import { Router } from "express";
import * as sessionController from "../controllers/session.controller";
import validateRequest from "../middlewares/validateRequest";
import {
  availableSessionsQuerySchema,
  bookSessionSchema,
  createSessionSchema,
  sessionIdParamSchema,
} from "../validators/session.validator";

const router = Router();

router.post("/", validateRequest(createSessionSchema), sessionController.createSession);
router.get("/available", validateRequest(availableSessionsQuerySchema), sessionController.getAvailableSessions);
router.post("/:id/book", validateRequest(bookSessionSchema), sessionController.bookSession);
router.patch("/:id/complete", validateRequest(sessionIdParamSchema), sessionController.completeSession);

export default router;
