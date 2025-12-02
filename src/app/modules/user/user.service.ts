/* eslint-disable @typescript-eslint/no-unused-vars */
import AppError from "../../errorHelpers/AppError";
import { IAuthProvider, IUser, Role } from "./user.interface";
import User from "./user.model";
import httpStatus from "http-status-codes";
import bcryptjs from "bcryptjs";
import { envVars } from "../../config/env";
import { JwtPayload } from "jsonwebtoken";
// Create a new user
const createUser = async (payload: Partial<IUser>): Promise<IUser> => {
  const { email, password, ...rest } = payload;

  const ifUserExists = await User.findOne({ email });

  if (ifUserExists) {
    throw new AppError("User already Exists", httpStatus.BAD_REQUEST);
  }

  const hashedPassword = await bcryptjs.hash(
    password as string,
    Number(envVars.BCRYPT_SALT_ROUND)
  );

  // const isPasswordMatch = await bcryptjs.compare(password as string, hashedPassword);

  const authProvider: IAuthProvider = {
    provider: "credentials",
    providerId: email as string,
  };
  const user = await User.create({
    email,
    password: hashedPassword,
    auth: [authProvider],

    ...rest,
  });

  return user;
};

const updateUser = async (
  userId: string,
  payload: Partial<IUser>,
  decodedToken: JwtPayload
) => {
  /**
   * email- cannot be updated
   * name,phone,passwrd,addreess
   * password- can be updated
   * ONLY ADMIN, SUPER ADMIN CAN UPDATE
   * promoting to super admin - superadmin
   */

  if (payload.role !== decodedToken.role) {
    if (decodedToken.role === Role.USER || decodedToken.role === Role.GUIDE) {
      throw new AppError("You are not authorized", httpStatus.FORBIDDEN);
    }

    if (payload.role === Role.SUPER_ADMIN && decodedToken.role === Role.ADMIN) {
      throw new AppError ("You are not authorized", httpStatus.FORBIDDEN);
    }
  }
  if(payload.isActive || payload.isDeleted || payload.isVerified){
  if(decodedToken.role === Role.USER || decodedToken.role === Role.GUIDE){
    throw new AppError ("You are not authorized", httpStatus.FORBIDDEN);
  }
  }


//  start from here***********************
};

// Get all users with optional total count
const getAllUsers = async () => {
  const users = await User.find(); // Retrieve all users
  const totalUsers = await User.countDocuments(); // Count total documents

  return {
    data: users,
    meta: { total: totalUsers },
  };
};

export const UserServices = {
  createUser,
  getAllUsers,
};
