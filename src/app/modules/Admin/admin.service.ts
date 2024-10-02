import httpStatus from 'http-status';
import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../errors/AppError';

import { User } from '../User/user.model';
import { UserSearchableFields, UserStatus } from '../User/user.constant';
import { TUserStatus } from './admin.interface';





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



const blockUserIntoDB = async (userId: string, updateStatus: TUserStatus) => {



    const userExists = await User.isUserExists(userId);


    if (!userExists) {
        throw new AppError(httpStatus.UNAUTHORIZED, 'User not Found');
    }


    const blockUser = await User.findByIdAndUpdate(
        userId,
        { status: updateStatus?.status || UserStatus.IN_PROGRESS },
        { new: true },
    );


    return blockUser;


};
//  Do it After some minuite Better approch

const deleteUserFromDB = async (userId: string) => {

    const userExists = await User.isUserExists(userId);

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




export const AdminServices = {

    getAllUsersFromDB,
    getSingleUserFromDB,
    deleteUserFromDB,
    blockUserIntoDB,
};
