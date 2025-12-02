import { NextFunction, Request, Response } from "express";
import AppError from "../errorHelpers/AppError";
import { verifyToken } from "../utils/jwt";
import { envVars } from "../config/env";
import { JwtPayload } from "jsonwebtoken";

export const checkAuth =
  (...authRoles: string[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    const accessToken = req.headers.authorization;

    try {
      if (!accessToken) {
        throw new AppError("No token Received", 403);
      }
      const verifiedToken = verifyToken(
        accessToken,
        envVars.JWT_ACCESS_SECRET
      ) as JwtPayload;
      if (!verifiedToken) {
        throw new AppError("No token Received", 403);
      }

      //   authRoles=["ADMIN","SUPER_ADMIN"].includes(verifiedToken.role)

      if (!authRoles.includes(verifiedToken.role)) {
        throw new AppError("You are not authorized", 403);
      }

      req.user = verifiedToken;

      console.log(verifiedToken);

      next();
    } catch (error) {
      next(error);
    }
  };
