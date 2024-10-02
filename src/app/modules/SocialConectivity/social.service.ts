import httpStatus from "http-status";
import AppError from "../../errors/AppError";

import { Comment, Rating, Vote } from "./social.model";
import { Recipe } from "../Recipe/recipe.model";
import { Types } from "mongoose";
import { User } from "../User/user.model";


// -------------- Rate Recpe section ---------
const rateRecipeIntoDB = async (currentUserId: string, recipeId: string, rating: any) => {

  const userExists = await User.isUserExists(currentUserId);


  if (!userExists) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'User not found!')
  }


  const existingRating = await Rating.findOne({ recipeId, userId: currentUserId });

  if (existingRating) {
    // Update existing rating
    existingRating.rating = rating?.rating;
    await existingRating.save();
  } else {
    // Create new rating
    const newRating = new Rating({ recipeId, userId: currentUserId, ...rating });
    await newRating.save();

    // Push the new rating into the recipe
    await Recipe.findByIdAndUpdate(recipeId, { $push: { ratings: newRating._id } });
  }


};

const getRecipeRatingsFromDB = async (recipeId: string) => {

  const ratings = await Rating.find({ recipeId }).populate('userId').populate('recipeId');
  return ratings;

};

const getAvarageRecipeRatingsFromDB = async (recipeId: string) => {
  const averageRating = await Rating.aggregate([
    { $match: { recipeId } },
    { $group: { _id: null, averageRating: { $avg: '$rating' } } },
  ]);

  // console.log(averageRating);
  return { averageRating: averageRating[0]?.averageRating || 0 }

};
// -------------- Comment Recpe section ---------
const postRecipeCommentIntoDB = async (currentUserId: string, recipeId: string, comment: any) => {

  const userExists = await User.isUserExists(currentUserId);

  if (!userExists) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'User not found!')
  }

  const newComment = { recipeId, userId: currentUserId, comment, }


  const savedComment = await Comment.create(newComment);

  await Recipe.findByIdAndUpdate(recipeId, { $push: { comments: savedComment._id } });

  return savedComment;



};

const getRecipeCommentFromDB = async (recipeId: string) => {
  const comments = await Comment.find({ recipeId }).populate('userId').populate('recipeId');
  return comments;
};


const editRecipeCommentFromDB = async (recipeId: string, commentId: string, content: any) => {

  const findRecipeinComment = await Comment.findOne({ recipeId });

  if (!findRecipeinComment) {
    throw new Error("Recipe Comment not exists in this recipe")
  }
  const updateComment = await Comment.findByIdAndUpdate(commentId, { comment: content }, { new: true });

  return updateComment;


};
const deleteRecipeCommentFromDB = async (recipeId: string, commentId: string,) => {

  // 
  await Comment.findByIdAndDelete(commentId);

  await Recipe.findByIdAndUpdate(recipeId, { $pull: { comments: commentId } });


};

// -------------- Vote Recpe section ---------

const upvoteRecipeIntoDB = async (recipeId: string, currentUserId: string) => {

  const userExists = await User.isUserExists(currentUserId);

  if (!userExists) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'User not found!')
  }

  // Check if the user has already voted on this recipe
  let vote = await Vote.findOne({ user: currentUserId, recipeId });

  let recipe = await Recipe.findById(recipeId);

  if (!recipe) {
    return { message: "Recipe not found" }
  }

  if (vote) {
    if (vote.upVote === 1) {
      // If already upvoted, remove the upvote (unvote)
      vote.upVote = 0;
      await vote.save();

      recipe.upVoteCount -= 1; // Decrease the upvote count in recipe
      await recipe.save();

      return { message: "Upvote removed" };
    } else {
      // If downvoted before, switch to upvote
      vote.upVote = 1;
      vote.downVote = 0;
      await vote.save();

      recipe.upVoteCount += 1;
      recipe.downVoteCount -= 1; // Decrease downvote count and increase upvote count
      await recipe.save();

      return { message: "Upvoted successfully" };
    }
  } else {
    // If no vote exists, create a new upvote
    vote = new Vote({ user: currentUserId, recipeId, upVote: 1, downVote: 0 });
    await vote.save();

    recipe.upVoteCount += 1;
    await recipe.save();

    return { message: "Upvoted successfully" }
  }

}




const downvoteRecipeIntoDB = async (recipeId: string, currentUserId: string) => {

  const userExists = await User.isUserExists(currentUserId);

  if (!userExists) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'User not found!')
  }

  let vote = await Vote.findOne({ user: currentUserId, recipeId });
  let recipe = await Recipe.findById(recipeId);

  if (!recipe) {
    return { message: "Recipe not found" };
  }

  if (vote) {
    if (vote.downVote === 1) {
      // If already downvoted, remove the downvote (unvote)
      vote.downVote = 0;
      await vote.save();

      recipe.downVoteCount -= 1;
      await recipe.save();

      return { message: "Downvote removed" };
    } else {
      // If upvoted before, switch to downvote
      vote.downVote = 1;
      vote.upVote = 0;
      await vote.save();

      recipe.downVoteCount += 1;
      recipe.upVoteCount -= 1;
      await recipe.save();

      return { message: "Downvoted successfully" };
    }
  } else {

    // If no vote exists, create a new downvote
    vote = new Vote({ user: currentUserId, recipeId, upVote: 0, downVote: 1 });
    await vote.save();
    recipe.downVoteCount += 1;
    await recipe.save();

    return { message: "Downvoted successfully" };
  }


};

const getvotesFromDB = async (recipeId: string) => {

  const recipe = await Recipe.findById(recipeId).lean();
  const votes = await Vote.aggregate([
    { $match: { recipeId: new Types.ObjectId(recipeId) } },
    {
      $group: {
        _id: "$recipeId",
        totalUpVotes: { $sum: "$upVote" },
        totalDownVotes: { $sum: "$downVote" }
      }
    }
  ]);

  recipe!.upVoteCount = votes[0]?.totalUpVotes || 0;
  recipe!.downVoteCount = votes[0]?.totalDownVotes || 0;

  return recipe;


};

export const SocailConectivityServices = {
  rateRecipeIntoDB,
  getRecipeRatingsFromDB,
  getAvarageRecipeRatingsFromDB,
  postRecipeCommentIntoDB,
  getRecipeCommentFromDB,
  editRecipeCommentFromDB,
  deleteRecipeCommentFromDB,
  upvoteRecipeIntoDB,
  downvoteRecipeIntoDB,
  getvotesFromDB

};
