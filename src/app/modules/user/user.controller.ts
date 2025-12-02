/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
// src/app/modules/user/user.controller.ts
import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes";
import { UserServices } from "./user.service";
import { sendResponse } from "../../utils/sendResponse";

// import AppError from "../../errorHelpers/AppError";

// Properly define catchAsync
const catchAsync =
  (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) =>
  (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(fn(req, res, next)).catch((err) => next(err));
  };

// Controller to create a user
const createUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // Optional: Test global error handler
    // throw new AppError("Fake error for testing", httpStatus.BAD_REQUEST);

    const user = await UserServices.createUser(req.body);

    // res.status(httpStatus.CREATED).json({
    //   status: "success",
    //   data: user,
    // });

    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "User created successfully",
      data: user,
    });
  }
);

// Controller to get all users
const getAllUsers = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await UserServices.getAllUsers();

    // res.status(httpStatus.OK).json({
    //   status: "success",
    //   message: "All Users retrieved successfully",
    //   data: user,
    // });

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "All Users retrieved successfully",
      data: result.data,
      meta: result.meta,
    });
  }
);

export const UserController = {
  createUser,
  getAllUsers,
};
