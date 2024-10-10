import QueryBuilder from "../../builder/QueryBuilder";
import { Recipe } from "../Recipe/recipe.model";
import { recipeSearchableFields } from "./feed.constant";


const getAllPublicRecipeFromDB = async (query: Record<string, unknown>) => {
    const UserQuery = new QueryBuilder(Recipe.find({ isPremium: false, isDeleted: false }).populate('author').lean(), query)
        .search(recipeSearchableFields)
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


const getAllPrimiumRecipeFromDB = async (query: Record<string, unknown>) => {
    const UserQuery = new QueryBuilder(Recipe.find({ isPremium: true, isDeleted: false }).populate('author'), query)
        .search(recipeSearchableFields)
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


export const FeedService = {
    getAllPublicRecipeFromDB,
    getAllPrimiumRecipeFromDB
}