/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
// src/app/middlewares/globalErrorhandler.ts
import { envVars } from "../config/env";
import { Request, Response, NextFunction } from "express";
import AppError from "../errorHelpers/AppError";

export const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode = err?.statusCode ?? 500;
  let message = err?.message || "Something went wrong";

  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  } else if (err instanceof Error) {
    statusCode = 500;
    message = err.message;
  }

  res.status(statusCode).json({
    success: false,
    message,
    err,
    stack: envVars.NODE_ENV === "development" ? err.stack : undefined,
  });
};
