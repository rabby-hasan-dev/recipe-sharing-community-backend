import httpStatus from 'http-status';

import AppError from '../../errors/AppError';
import { USER_ROLE } from '../../constant';
import { User } from './user.model';
import { JwtPayload } from 'jsonwebtoken';
import { TUser } from './user.interface';

import { TImageFile } from '../../interface/image.interface';

const getMyProfileIntoDB = async (email: string, role: string) => {
  let result = null;
  if (role === USER_ROLE.user) {
    result = await User.findOne({ email: email });
  }
  return result;
};

const updateUserDataIntoDB = async (
  user: JwtPayload,
  payload: Partial<TUser>,
  file: TImageFile,
) => {
  const { userId, email } = user;
  const userExists = User.isUserExists(userId);

  if (!userExists) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'User not Authorized');
  }

  if (file?.path) {
    payload.profilePicture = file.path;
  }

  const { name, ...remainingUserData } = payload;
  const modifiedUpdatedData: Record<string, unknown> = {
    ...remainingUserData,
  };

  if (name && Object.keys(name).length) {
    for (const [key, value] of Object.entries(name)) {
      modifiedUpdatedData[`name.${key}`] = value;
    }
  }

  const result = await User.findOneAndUpdate(
    { email: email },
    modifiedUpdatedData,
    { new: true, runValidators: true },
  );
  return result;
};

const getSingleUserFromDB = async (id: string) => {
  const result = await User.findById(id);
  return result;
};



export const UserServices = {
  updateUserDataIntoDB,
  getMyProfileIntoDB,

  getSingleUserFromDB,

};
