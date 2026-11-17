import { Request, Response } from "express";
import * as userService from "../services/user.service";
import * as sessionService from "../services/session.service";
import ApiError from "../utils/ApiError";
import asyncHandler from "../utils/asyncHandler";

export const createUser = asyncHandler(async (req: Request, res: Response) => {
  const { fullName, email, phone } = req.body;

  const existingUser = await userService.findUserByEmail(email);
  if (existingUser) {
    throw new ApiError(409, "Email is already registered");
  }

  const user = await userService.createUser({ fullName, email, phone });

  res.status(201).json({ success: true, data: user });
});

export const getUserSessions = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const user = await userService.findUserById(id);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const [grouped] = await sessionService.getUserSessionsGrouped(id);

  res.status(200).json({
    success: true,
    data: {
      upcoming: grouped?.upcoming || [],
      completed: grouped?.completed || [],
    },
  });
});
