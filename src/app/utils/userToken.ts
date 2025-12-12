import { JwtPayload } from "jsonwebtoken";
import { envVars } from "../config/env";
import { IUser } from "../modules/user/user.interface";
import { generateToken, verifyToken } from "./jwt";
import AppError from "../errorHelpers/AppError";
import User from "../modules/user/user.model";
import httpStatus from "http-status-codes";
export const createUserToken = (user:Partial<IUser>) => {
      const jwtPayload = {
        userId: user._id,
        email: user.email,
        role: user.role,
        name: user.name
  };
  const accessToken = generateToken(
    jwtPayload,
    envVars.JWT_ACCESS_SECRET,
    envVars.JWT_ACCESS_EXPIRE
  );

  const refreshToken = generateToken(
    jwtPayload,
    envVars.JWT_REFRESH_SECRET,
    envVars.JWT_REFRESH_EXPIRED
  );



  return {
    accessToken,
    refreshToken,

  };
}; 



export const createNewAccessTokenWithRefreshToken =  async(refreshToken:string)=>{
  const verifiedRefreshToken = verifyToken(
    refreshToken,
    envVars.JWT_REFRESH_SECRET
  ) as JwtPayload;

  const user = await User.findOne({ email: verifiedRefreshToken.email });

  if (!user) {
    throw new AppError("User does not exist", httpStatus.BAD_REQUEST);
  }

  if (user.isDeleted) {
    throw new AppError("User is deleted", httpStatus.BAD_REQUEST);
  }

  if (user.isActive === "BLOCKED") {
    throw new AppError("User is blocked", httpStatus.BAD_REQUEST);
  }

  // Create a new access token ONLY (refresh token stays the same)
  const jwtPayload = {
    email: user.email,
    role: user.role,
    userId: user._id,
  };

  const accessToken = generateToken(
    jwtPayload,
    envVars.JWT_ACCESS_SECRET,
    envVars.JWT_ACCESS_EXPIRE
  );



  return accessToken
}
