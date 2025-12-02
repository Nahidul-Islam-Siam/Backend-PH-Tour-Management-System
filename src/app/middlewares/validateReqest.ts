import { NextFunction, Request, Response } from "express";
import { ZodError, ZodSchema } from "zod";

export const validateRequest = (schema:ZodSchema) => async (req:Request, res:Response, next:NextFunction) => {
  try {
    req.body = schema.parse(req.body);
    next();
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: error.issues.map(e => ({
          field: e.path.join("."),
          message: e.message,
        })),
      });
    }

    return res.status(500).json({ success: false, message: "Server error" });
  }
};
