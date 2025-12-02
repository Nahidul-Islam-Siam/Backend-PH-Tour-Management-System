/* eslint-disable @typescript-eslint/no-unused-vars */
import AppError from "../../errorHelpers/AppError";
import { IAuthProvider, IsActive, IUser, Role } from "./user.interface";
import User from "./user.model";
import httpStatus from "http-status-codes";
import bcryptjs from "bcryptjs";
import { envVars } from "../../config/env";
import { JwtPayload } from "jsonwebtoken";

// Create a new user
const createUser = async (payload: Partial<IUser>): Promise<IUser> => {
  const { email, password, role, ...rest } = payload;

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

  // Force default role to USER (prevent arbitrary SUPER_ADMIN creation)
  const finalRole = Role.USER;

  const user = await User.create({
    email,
    password: hashedPassword,
    role: finalRole, // always USER
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

  const ifUserExists = await User.findById(userId);

  if (!ifUserExists) {
    throw new AppError("User does not exist", httpStatus.BAD_REQUEST);
  }

  // if (ifUserExists.isDeleted || ifUserExists.isActive === IsActive.BLOCKED) {
  //   throw new AppError("User is deleted or blocked", httpStatus.BAD_REQUEST);
  // }

  // role update authorization
  if (payload.role !== undefined) {
    if (decodedToken.role === Role.USER || decodedToken.role === Role.GUIDE) {
      throw new AppError("You are not authorized", httpStatus.FORBIDDEN);
    }

    // admin cannot make super admin
    if (payload.role === Role.SUPER_ADMIN) {
      if (decodedToken.role !== Role.SUPER_ADMIN) {
        throw new AppError(
          "Only SUPER_ADMIN can assign SUPER_ADMIN role",
          httpStatus.FORBIDDEN
        );
      }
    }
  }

  // status update authorization
  if (
    payload.isActive !== undefined ||
    payload.isDeleted !== undefined ||
    payload.isVerified !== undefined
  ) {
    if (decodedToken.role === Role.USER || decodedToken.role === Role.GUIDE) {
      throw new AppError("You are not authorized", httpStatus.FORBIDDEN);
    }
  }

  //  start from here***********************

  if (payload.password) {
    payload.password = await bcryptjs.hash(
      payload.password,
      envVars.BCRYPT_SALT_ROUND
    );
  }

  // const newUpdatedUser = await User.findOneAndUpdate(userId, payload, {
  //   new: true, runValidators: true,
  // });

  const newUpdatedUser = await User.findByIdAndUpdate(userId, payload, {
    new: true,
    runValidators: true,
  });

  return newUpdatedUser;
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
  updateUser,
};
