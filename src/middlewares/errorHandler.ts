import { NextFunction, Request, Response } from "express";
import ApiError from "../utils/ApiError";

// keep this at the very end of the middleware chain in app.ts
const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({ success: false, message: err.message });
  }

  if (err.code === 11000) {
    return res.status(409).json({ success: false, message: "Email is already registered" });
  }

  if (err.name === "CastError") {
    return res.status(400).json({ success: false, message: "Invalid id format" });
  }

  console.error(err);
  return res.status(500).json({ success: false, message: "Something went wrong" });
};

export default errorHandler;
