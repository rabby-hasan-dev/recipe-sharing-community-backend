import httpStatus from 'http-status';
import AppError from '../../errors/AppError';

import { Comment, Rating, Vote } from './social.model';
import { Recipe } from '../Recipe/recipe.model';
import mongoose from 'mongoose';
import { User } from '../User/user.model';
import { validateRating } from './social.utils';

// -------------- Rate Recpe section ---------

// Submit or update a rating, then calculate and update the recipe's average rating
const rateAndCalculateAverage = async (
  currentUserId: string,
  recipeId: string,
  ratingValue: number,
) => {
  validateRating(ratingValue);

  const userExists = await User.isUserExists(currentUserId);
  const recipeExists = await Recipe.isRecipeExists(recipeId);
  if (!userExists || !recipeExists) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'One or both recipe and users not found',
    );
  }

  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    const existingRating = await Rating.findOne({
      recipeId,
      userId: currentUserId,
    });

    if (existingRating) {
      existingRating.rating = ratingValue;
      await existingRating.save({ session });
    } else {
      await Rating.create(
        [{ recipeId, userId: currentUserId, rating: ratingValue }],
        { session },
      );
      // await Recipe.findByIdAndUpdate(recipeId, { $push: { ratings: newRating._id } }, { session });
    }

    // Aggregate to update the average rating and total rating count
    const ratingsData = await Rating.aggregate([
      { $match: { recipeId: new mongoose.Types.ObjectId(recipeId) } },
      {
        $group: {
          _id: null,
          averageRating: { $avg: '$rating' },
          totalRatings: { $sum: 1 },
        },
      },
    ]).session(session);

    const averageRating = ratingsData[0]?.averageRating || 0;
    const totalRatings = ratingsData[0]?.totalRatings || 0;

    // console.log('inside rating service==>', ratingsData)
    // Update the recipe with new average rating and total ratings
    await Recipe.findByIdAndUpdate(
      recipeId,
      { averageRating, totalRatings },
      { session },
    );

    await session.commitTransaction();
    session.endSession();

    return {
      averageRating,
      totalRatings,
      message: 'Rating submitted successfully!',
    };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Failed to submit rating!',
    );
  }
};

const getRecipeRatingsFromDB = async (recipeId: string) => {
  const ratings = await Rating.find({ recipeId })
    .populate('userId')
    .populate('recipeId');
  return ratings;
};

// -------------- Comment Recpe section ---------
const postRecipeCommentIntoDB = async (
  currentUserId: string,
  recipeId: string,
  comment: any,
) => {
  const userExists = await User.isUserExists(currentUserId);

  if (!userExists) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'User not found!');
  }
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const newComment = { recipeId, userId: currentUserId, comment };
    const savedComment = await Comment.create([newComment], { session });

    // Check if the Recipe exists
    const recipe = await Recipe.findById(recipeId).session(session); // Ensure session is used for the query
    if (!recipe) {
      throw new AppError(httpStatus.NOT_FOUND, 'Recipe not found!');
    }

    // Update the Recipe with the new comment and increment the commentCount
    await Recipe.findByIdAndUpdate(
      recipeId,
      {
        // $push: { comments: savedComment[0]._id },
        $inc: { totalComment: 1 }, // Increment the totalcomment
      },
      { new: true, session },
    );

    await session.commitTransaction();
    session.endSession();

    return savedComment;

    // @ts-nocheck
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Failed to submit comment!',
    );
  }
};

const getRecipeCommentFromDB = async (recipeId: string) => {
  return await Comment.find({ recipeId })
    .populate('userId')
    .populate('recipeId')
    .sort({ createdAt: -1 });
};

const editRecipeCommentFromDB = async (
  userId: string,
  commentId: string,
  content: any,
) => {
  const comment = await Comment.findOne({ _id: commentId, userId });

  if (!comment) {
    throw new Error(
      'Comment not found or you are not authorized to edit this comment',
    );
  }
  const updateComment = await Comment.findByIdAndUpdate(
    commentId,
    { comment: content },
    { new: true },
  );

  return updateComment;
};

const deleteRecipeCommentFromDB = async (
  recipeId: string,
  commentId: string,
) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const deleteComment = await Comment.findByIdAndDelete(commentId, { session });

    // Check if the Recipe exists
    const recipe = await Recipe.findById(recipeId).session(session); // Ensure session is used for the query
    if (!recipe) {
      throw new AppError(httpStatus.NOT_FOUND, 'Recipe not found!');
    }

    await Recipe.findByIdAndUpdate(
      recipeId,
      {
        // $pull: { comments: commentId },
        $inc: { totalComment: -1 }, //  decrement total comment count
      },
      { session },
    );

    await session.commitTransaction();
    session.endSession();
    return deleteComment;
    // @ts-nocheck
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Failed to submit comment deletion!',
    );
  }
};

// -------------- Vote Recpe section ---------

const toggleVote = async (
  recipeId: string,
  userId: string,
  type: 'upvote' | 'downvote',
) => {
  const userExists = await User.isUserExists(userId);
  if (!userExists)
    throw new AppError(httpStatus.UNAUTHORIZED, 'User not found!');

  const recipe = await Recipe.findById(recipeId);
  if (!recipe) throw new AppError(httpStatus.NOT_FOUND, 'Recipe not found!');

  // Find or create vote
  let vote = await Vote.findOne({ user: userId, recipeId });

  if (vote) {
    if (
      (type === 'upvote' && vote.value === 1) ||
      (type === 'downvote' && vote.value === -1)
    ) {
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
    vote = new Vote({
      user: userId,
      recipeId,
      value: type === 'upvote' ? 1 : -1,
    });
    await vote.save();
    type === 'upvote' ? recipe.upVoteCount++ : recipe.downVoteCount++;
    await recipe.save();
    return { message: `${type} added` };
  }
};

export const SocailConectivityServices = {
  rateAndCalculateAverage,
  getRecipeRatingsFromDB,
  postRecipeCommentIntoDB,
  getRecipeCommentFromDB,
  editRecipeCommentFromDB,
  deleteRecipeCommentFromDB,
  toggleVote,
};
