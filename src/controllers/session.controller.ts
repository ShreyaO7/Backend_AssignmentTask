import { Request, Response } from "express";
import * as sessionService from "../services/session.service";
import * as teacherService from "../services/teacher.service";
import * as userService from "../services/user.service";
import { SessionStatus } from "../models/session.model";
import ApiError from "../utils/ApiError";
import asyncHandler from "../utils/asyncHandler";

export const createSession = asyncHandler(async (req: Request, res: Response) => {
  const { teacherId, startTime, endTime } = req.body;

  const teacher = await teacherService.findTeacherById(teacherId);
  if (!teacher) {
    throw new ApiError(404, "Teacher not found");
  }

  if (new Date(endTime) <= new Date(startTime)) {
    throw new ApiError(400, "endTime must be greater than startTime");
  }

  const session = await sessionService.createSession({ teacherId, startTime, endTime });

  res.status(201).json({ success: true, data: session });
});

export const getAvailableSessions = asyncHandler(async (req: Request, res: Response) => {
  const { dateTimestamp } = req.query as { dateTimestamp: string };

  const day = new Date(Number(dateTimestamp));
  const startOfDay = new Date(day);
  startOfDay.setUTCHours(0, 0, 0, 0);
  const endOfDay = new Date(day);
  endOfDay.setUTCHours(23, 59, 59, 999);

  const sessions = await sessionService.getAvailableSessionsBetween(startOfDay, endOfDay);

  res.status(200).json({ success: true, data: sessions });
});

export const bookSession = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { userId } = req.body;

  const user = await userService.findUserById(userId);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const session = await sessionService.findSessionById(id);
  if (!session) {
    throw new ApiError(404, "Session not found");
  }

  if (session.status !== SessionStatus.AVAILABLE) {
    throw new ApiError(409, "Session is not available for booking");
  }

  const updatedSession = await sessionService.updateSessionById(id, {
    status: SessionStatus.BOOKED,
    userId,
  });

  res.status(200).json({ success: true, data: updatedSession });
});

export const completeSession = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const session = await sessionService.findSessionById(id);
  if (!session) {
    throw new ApiError(404, "Session not found");
  }

  if (session.status !== SessionStatus.BOOKED) {
    throw new ApiError(409, "Only booked sessions can be marked as completed");
  }

  const updatedSession = await sessionService.updateSessionById(id, {
    status: SessionStatus.COMPLETED,
    completedAt: new Date(),
  });

  res.status(200).json({ success: true, data: updatedSession });
});
