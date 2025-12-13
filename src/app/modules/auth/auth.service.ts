import AppError from "../../errorHelpers/AppError";
import { IUser } from "../user/user.interface";
import httpStatus from "http-status-codes";
import User from "../user/user.model";
import bcryptjs from "bcryptjs";
import {
  createNewAccessTokenWithRefreshToken,
  createUserToken,
} from "../../utils/userToken";
import { JwtPayload } from "jsonwebtoken";
import { envVars } from "../../config/env";

// ============================================================================
// LOGIN
// ============================================================================
const credintialsLogin = async (payload: Partial<IUser>) => {
  const { email, password } = payload;

  const user = await User.findOne({ email });

  if (!user) {
    throw new AppError("Email does not exist", httpStatus.BAD_REQUEST);
  }

  const isPasswordMatch = await bcryptjs.compare(
    password as string,
    user.password
  );

  if (!isPasswordMatch) {
    throw new AppError("Incorrect password", httpStatus.BAD_REQUEST);
  }

  const userToken = createUserToken(user);

  const userObj = user.toObject() as Partial<IUser>;
  delete userObj.password;

  return {
    accessToken: userToken.accessToken,
    refreshToken: userToken.refreshToken,
    user: userObj,
  };
};

// ============================================================================
// REFRESH TOKEN
// ============================================================================
const getNewAccessToken = async (refreshToken: string) => {
  const newAccessToken = await createNewAccessTokenWithRefreshToken(
    refreshToken
  );

  return {
    accessToken: newAccessToken,
  };
};

const resetPassword = async (
  oldPassword: string,
  newPassword: string,
  decodedToken: JwtPayload
) => {
  const userId = (decodedToken as JwtPayload & { userId?: string }).userId;
  if (!userId) {
    throw new AppError("Invalid token", httpStatus.UNAUTHORIZED);
  }

  const user = await User.findById(userId);
  if (!user) {
    throw new AppError("User not found", httpStatus.NOT_FOUND);
  }

  const isOldPasswordMatch = await bcryptjs.compare(
    oldPassword,
    user.password as string
  );

  if (!isOldPasswordMatch) {
    throw new AppError(
      "Incorrect old password",
      httpStatus.UNAUTHORIZED,
      "Old Password does not match"
    );
  }

  const newHashedPassword = await bcryptjs.hash(
    newPassword,
    Number(envVars.BCRYPT_SALT_ROUND)
  );

  user.password = newHashedPassword;
  await user.save();

  // return true;
};
// ============================================================================
// EXPORT
// ============================================================================
export const AuthServices = {
  credintialsLogin,
  getNewAccessToken,
  resetPassword,
};
