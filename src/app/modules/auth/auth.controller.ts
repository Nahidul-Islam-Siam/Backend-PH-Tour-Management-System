/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync"
import httpStatus from "http-status-codes";

import { AuthServices } from "./auth.service";
import { sendResponse } from "../../utils/sendResponse";
const credintialsLogin =catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  // Optional: Test global error handler
  // throw new AppError("Fake error for testing", httpStatus.BAD_REQUEST);

//   const user = await UserServices.createUser(req.body);

  // res.status(httpStatus.CREATED).json({
  //   status: "success",
  //   data: user,
  // });

  const loginInfo = await AuthServices.credintialsLogin(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User Login successfully",
    data: loginInfo,

  });
});





const getNewAccessToken =catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  // Optional: Test global error handler
  // throw new AppError("Fake error for testing", httpStatus.BAD_REQUEST);

//   const user = await UserServices.createUser(req.body);

  // res.status(httpStatus.CREATED).json({
  //   status: "success",
  //   data: user,
  // });

  const tokenInfo = await AuthServices.credintialsLogin(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User Login successfully",
    data: tokenInfo,

  });
});

export const AuthController = {
    credintialsLogin
}