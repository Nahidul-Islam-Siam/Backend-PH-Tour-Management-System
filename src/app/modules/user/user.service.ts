import AppError from "../../errorHelpers/AppError";
import { IAuthProvider, IUser } from "./user.interface";
import User from "./user.model";
import httpStatus from "http-status-codes";
import bcryptjs from "bcryptjs";
import { envVars } from "../../config/env";
// Create a new user
const createUser = async (payload: Partial<IUser>): Promise<IUser> => {
  const { email, password, ...rest } = payload;

  const ifUserExists = await User.findOne({ email });

  if (ifUserExists) {
    throw new AppError("User already Exists", httpStatus.BAD_REQUEST);
  }

  const hashedPassword = await bcryptjs.hash(password as string,Number(envVars.BCRYPT_SALT_ROUND));

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
