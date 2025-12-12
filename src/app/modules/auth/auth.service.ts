import AppError from "../../errorHelpers/AppError";
import { IUser } from "../user/user.interface";
import httpStatus from "http-status-codes";
import User from "../user/user.model";
import bcryptjs from "bcryptjs";
import { createNewAccessTokenWithRefreshToken, createUserToken } from "../../utils/userToken";



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

const newAccessToken = await createNewAccessTokenWithRefreshToken(refreshToken)

return {
  accessToken: newAccessToken
}
};



// ============================================================================
// EXPORT
// ============================================================================
export const AuthServices = {
  credintialsLogin,
  getNewAccessToken,
};
