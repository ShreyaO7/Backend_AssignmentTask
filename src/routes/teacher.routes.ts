import { Router } from "express";
import * as teacherController from "../controllers/teacher.controller";
import validateRequest from "../middlewares/validateRequest";
import { createTeacherSchema } from "../validators/teacher.validator";

const router = Router();

router.post("/", validateRequest(createTeacherSchema), teacherController.createTeacher);

export default router;
