import { Types } from "mongoose";
import Session, { SessionStatus } from "../models/session.model";

export const createSession = (data: { teacherId: string; startTime: Date; endTime: Date }) => {
  return Session.create(data);
};

export const findSessionById = (id: string) => {
  return Session.findById(id);
};

export const updateSessionById = (id: string, update: Record<string, unknown>) => {
  return Session.findByIdAndUpdate(id, update, { new: true });
};

// API 3 - available sessions for a given day, built with the aggregation pipeline
export const getAvailableSessionsBetween = (startOfDay: Date, endOfDay: Date) => {
  return Session.aggregate([
    {
      $match: {
        status: SessionStatus.AVAILABLE,
        startTime: { $gte: startOfDay, $lte: endOfDay },
      },
    },
    {
      $lookup: {
        from: "teachers",
        localField: "teacherId",
        foreignField: "_id",
        as: "teacher",
      },
    },
    { $unwind: "$teacher" },
    {
      $project: {
        startTime: 1,
        endTime: 1,
        status: 1,
        "teacher._id": 1,
        "teacher.fullName": 1,
        "teacher.specialization": 1,
        "teacher.experience": 1,
      },
    },
    { $sort: { startTime: 1 } },
  ]);
};

// API 6 - user's sessions split into upcoming / completed, built with the aggregation pipeline
export const getUserSessionsGrouped = (userId: string) => {
  return Session.aggregate([
    { $match: { userId: new Types.ObjectId(userId) } },
    {
      $lookup: {
        from: "teachers",
        localField: "teacherId",
        foreignField: "_id",
        as: "teacher",
      },
    },
    { $unwind: "$teacher" },
    {
      $facet: {
        upcoming: [{ $match: { status: SessionStatus.BOOKED } }, { $sort: { startTime: 1 } }],
        completed: [{ $match: { status: SessionStatus.COMPLETED } }, { $sort: { completedAt: -1 } }],
      },
    },
  ]);
};
