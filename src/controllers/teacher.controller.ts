import { Request, Response } from "express";
import * as teacherService from "../services/teacher.service";
import ApiError from "../utils/ApiError";
import asyncHandler from "../utils/asyncHandler";

// not asked in the assignment directly, but a teacher has to exist before
// a session can be created for them, so this endpoint is needed to test API 2
export const createTeacher = asyncHandler(async (req: Request, res: Response) => {
  const { fullName, email, specialization, experience } = req.body;

  const existingTeacher = await teacherService.findTeacherByEmail(email);
  if (existingTeacher) {
    throw new ApiError(409, "Email is already registered");
  }

  const teacher = await teacherService.createTeacher({ fullName, email, specialization, experience });

  res.status(201).json({ success: true, data: teacher });
});
