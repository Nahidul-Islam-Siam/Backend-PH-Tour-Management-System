/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import httpStatus from "http-status-codes";

import { AuthServices } from "./auth.service";
import { sendResponse } from "../../utils/sendResponse";
import AppError from "../../errorHelpers/AppError";
import { setAuthCookie } from "../../utils/SetCookies";
const credintialsLogin = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    // Optional: Test global error handler
    // throw new AppError("Fake error for testing", httpStatus.BAD_REQUEST);

    //   const user = await UserServices.createUser(req.body);

    // res.status(httpStatus.CREATED).json({
    //   status: "success",
    //   data: user,
    // });

    const loginInfo = await AuthServices.credintialsLogin(req.body);

    // res.cookie("refreshToken", loginInfo.refreshToken, {
    //   httpOnly: true,
    //   // maxAge: 24 * 60 * 60 * 1000,
    //   secure: false,
    // });

    setAuthCookie(res, loginInfo);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "User Login successfully",
      data: loginInfo,
    });
  }
);

const getNewAccessToken = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      throw new AppError("No refresh token found", httpStatus.BAD_REQUEST);
    }

    const tokenInfo = await AuthServices.getNewAccessToken(
      refreshToken as string
    );

    setAuthCookie(res, tokenInfo);

    //     res.cookie("accessToken", tokenInfo.accessToken, {
    //   httpOnly: true,
    //   // maxAge: 24 * 60 * 60 * 1000,
    //   secure: false,
    // });

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "New Access Token Retrieved Successfully",
      data: tokenInfo,
    });
  }
);

const logout = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    res.clearCookie("accessToken", {
      httpOnly: true,
      // maxAge: 24 * 60 * 60 * 1000,
      secure: false,
      sameSite: "lax",
    });

    res.clearCookie("refreshToken", {
      httpOnly: true,
      // maxAge: 24 * 60 * 60 * 1000,
      secure: false,
      sameSite: "lax",
    });

    //     res.cookie("accessToken", tokenInfo.accessToken, {
    //   httpOnly: true,
    //   // maxAge: 24 * 60 * 60 * 1000,
    //   secure: false,
    // });

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Logout Successfully",
      data: null,
    });
  }
);

const resetPassword = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {

    const newPassword = req.body.newPassword;
    const oldPassword = req.body.oldPassword;
    const decodedToken = req.user;
await AuthServices.resetPassword(oldPassword, newPassword, decodedToken);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Password Changed Successfully",
      data: null,
    });
  }
);

export const AuthController = {
  credintialsLogin,
  getNewAccessToken,
  logout,
  resetPassword,
};
