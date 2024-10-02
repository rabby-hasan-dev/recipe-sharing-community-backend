import httpStatus from "http-status";
import AppError from "../../errors/AppError";

import { Comment, Rating, Vote } from "./social.model";
import { Recipe } from "../Recipe/recipe.model";
import { Types } from "mongoose";
import { User } from "../User/user.model";


// -------------- Rate Recpe section ---------
const rateRecipeIntoDB = async (currentUserId: string, recipeId: string, rating: any) => {

  if (rating < 1 || rating > 5) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Rating should be between 1 and 5!');
  }

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


  // Update the Recipe with the new comment and increment the commentCount
  await Recipe.findByIdAndUpdate(
    recipeId,
    {
      $push: { comments: savedComment._id },
      $inc: { commentCount: 1 }, // Increment the comment count
    },
    { new: true }
  );


  return savedComment;



};

const getRecipeCommentFromDB = async (recipeId: string) => {

  const comments = await Comment.find({ recipeId }).populate('userId').populate('recipeId').sort({ createdAt: -1 });;
  return comments;
};


const editRecipeCommentFromDB = async (userId: string, commentId: string, content: any) => {

  const comment = await Comment.findOne({ _id: commentId, userId });

  if (!comment) {
    throw new Error("Comment not found or you are not authorized to edit this comment")
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


const toggleVote = async (recipeId: string, userId: string, type: 'upvote' | 'downvote') => {
  const userExists = await User.isUserExists(userId);
  if (!userExists) throw new AppError(httpStatus.UNAUTHORIZED, 'User not found!');

  const recipe = await Recipe.findById(recipeId);
  if (!recipe) throw new AppError(httpStatus.NOT_FOUND, 'Recipe not found!');

  // Find or create vote
  let vote = await Vote.findOne({ user: userId, recipeId });

  if (vote) {
    if ((type === 'upvote' && vote.value === 1) || (type === 'downvote' && vote.value === -1)) {
      // Remove vote (unvote)
      await Vote.deleteOne({ user: userId, recipeId });
      type === 'upvote' ? recipe.upVoteCount-- : recipe.downVoteCount--;
      await recipe.save();
      return { message: `${type} removed` };
    } else {
      // Switch vote
      vote.value = type === 'upvote' ? 1 : -1;
      await vote.save();
      recipe[type === 'upvote' ? 'upVoteCount' : 'downVoteCount']++;
      recipe[type === 'downvote' ? 'upVoteCount' : 'downVoteCount']--;
      await recipe.save();
      return { message: `${type} toggled` };
    }
  } else {
    // Create a new vote
    vote = new Vote({ user: userId, recipeId, value: type === 'upvote' ? 1 : -1 });
    await vote.save();
    type === 'upvote' ? recipe.upVoteCount++ : recipe.downVoteCount++;
    await recipe.save();
    return { message: `${type} added` };
  }
};




export const SocailConectivityServices = {
  rateRecipeIntoDB,
  getRecipeRatingsFromDB,
  getAvarageRecipeRatingsFromDB,
  postRecipeCommentIntoDB,
  getRecipeCommentFromDB,
  editRecipeCommentFromDB,
  deleteRecipeCommentFromDB,
  toggleVote,


};
