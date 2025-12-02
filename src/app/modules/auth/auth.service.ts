import AppError from "../../errorHelpers/AppError";
import { IUser } from "../user/user.interface";
import httpStatus from "http-status-codes";
import User from "../user/user.model";
import bcryptjs from "bcryptjs";
import { generateToken } from "../../utils/jwt";
import { envVars } from "../../config/env";
const credintialsLogin = async (payload: Partial<IUser>) => {
  const { email, password } = payload;

  const isUserExist = await User.findOne({ email });

  if (!isUserExist) {
    throw new AppError("Email Does not exist", httpStatus.BAD_REQUEST);
  }

  const isPasswordMatch = await bcryptjs.compare(
    password as string,
    isUserExist.password
  );

  if (!isPasswordMatch) {
    throw new AppError("Incorrect Password", httpStatus.BAD_REQUEST);
  }

  const jwtPayload = {
    email: isUserExist.email,
    role: isUserExist.role,
    userId: isUserExist._id,
  };
  const accessToken = generateToken(
    jwtPayload,
    envVars.JWT_ACCESS_SECRET,
    envVars.JWT_ACCESS_EXPIRE
  );

  const refreshToken = generateToken(
    jwtPayload,
    envVars.JWT_REFRESH_SECRET,
    envVars.JWT_REFRESH_SECRET
  );

  return {
    accessToken,
  };
};

//

export const AuthServices = {
  credintialsLogin,
};
