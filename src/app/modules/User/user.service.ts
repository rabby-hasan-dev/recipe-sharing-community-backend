import httpStatus from 'http-status';
import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../errors/AppError';
import { USER_ROLE } from '../../constant';
import { User } from './user.model';
import { JwtPayload } from 'jsonwebtoken';
import { TUser } from './user.interface';
import { UserSearchableFields } from './user.constant';
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

const getAllUsersFromDB = async (query: Record<string, unknown>) => {
  const UserQuery = new QueryBuilder(User.find(), query)
    .search(UserSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const meta = await UserQuery.countTotal();
  const result = await UserQuery.modelQuery;

  return {
    meta,
    result,
  };
};

//  Do it After some minuite Better approch

const deleteUserFromDB = async (userId: string) => {
  const userExists = User.isUserExists(userId);

  if (!userExists) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'User not Found');
  }

  const deletedUser = await User.findByIdAndUpdate(
    userId,
    { isDeleted: true },
    { new: true },
  );

  return deletedUser;
};

// const deleteUserFromDB = async (id: string) => {
//     const session = await mongoose.startSession();

//     try {
//         session.startTransaction();

//         const deletedUser = await User.findByIdAndUpdate(
//             id,
//             { isDeleted: true },
//             { new: true, session },
//         );

//         if (!deletedUser) {
//             throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete User');
//         }

//         // get user _id from deletedUser
//         const userId = deletedUser._id;

//         const deletedUserAnotherActivitys = await User.findByIdAndUpdate(
//             userId,
//             { isDeleted: true },
//             { new: true, session },
//         );

//         if (!deletedUser) {
//             throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete user');
//         }

//         await session.commitTransaction();
//         await session.endSession();

//         return deletedUser;
//     } catch (err) {
//         await session.abortTransaction();
//         await session.endSession();
//         throw new Error('Failed to delete User');
//     }
// };

export const UserServices = {
  updateUserDataIntoDB,
  getMyProfileIntoDB,
  getAllUsersFromDB,
  getSingleUserFromDB,
  deleteUserFromDB,
};
