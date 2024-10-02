import httpStatus from 'http-status';
import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../errors/AppError';

import { User } from '../User/user.model';
import { UserSearchableFields, UserStatus } from '../User/user.constant';
import { TUserStatus } from './admin.interface';
import { Recipe } from '../Recipe/recipe.model';



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



const createAdminIntoDB = async (id: string, role: string) => {
    const createAdmin = await User.findByIdAndUpdate(id,
        { role: role },
        { new: true }
    );
    return createAdmin;
};




const publishRecipeIntoDB = async (id: string) => {

    const recipe = await Recipe.findById(id);

    // If the recipe exists, toggle the isPublished field
    if (recipe) {
        const publishRecipe = await Recipe.findByIdAndUpdate(
            id,
            { isPublished: !recipe.isPublished }, // Toggle the current value
            { new: true }

        );
        return publishRecipe;
    } else {
        throw new Error('Recipe not found');
    }



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
    createAdminIntoDB,
    getAllUsersFromDB,
    getSingleUserFromDB,
    deleteUserFromDB,
    blockUserIntoDB,
    publishRecipeIntoDB,
};
