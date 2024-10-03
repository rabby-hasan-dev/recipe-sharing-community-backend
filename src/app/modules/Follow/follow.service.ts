import httpStatus from 'http-status';
import AppError from '../../errors/AppError';

import { Follower, Following } from './follow.model';
import { User } from '../User/user.model';
import mongoose from 'mongoose';

const followUserIntoDB = async (
  currentUserId: string,
  userToFollowId: string,
) => {
  if (currentUserId === userToFollowId) {
    throw new AppError(httpStatus.BAD_REQUEST, 'You cannot follow yourself');
  }

  const currentUserExists = await User.isUserExists(currentUserId);
  const userToFollowExists = await User.isUserExists(currentUserId);

  if (!currentUserExists || !userToFollowExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'One or both users not found');
  }

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    // Use $addToSet to ensure no duplicates are added
    await Following.updateOne(
      { user: currentUserId },
      { $addToSet: { following: userToFollowId } },
      { upsert: true, session }, // Create if it doesn't exist
    );

    await Follower.updateOne(
      { user: userToFollowId },
      { $addToSet: { followers: currentUserId } },
      { upsert: true, session },
    );

    // Update the followersCount and followingCount in the User collection
    await User.findByIdAndUpdate(
      currentUserId,
      { $inc: { followingCount: 1 } },
      { session },
    );
    await User.findByIdAndUpdate(
      userToFollowId,
      { $inc: { followerCount: 1 } },
      { session },
    );
    await session.commitTransaction();
    session.endSession();

    return {
      message: 'User followed successfully',
    };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Failed to follow user',
    );
  }
};

const UnfollowUserIntoDB = async (
  currentUserId: string,
  userToUnfollowId: string,
) => {
  if (currentUserId === userToUnfollowId) {
    throw new AppError(httpStatus.BAD_REQUEST, 'You cannot Unfollow yourself');
  }

  const currentUserExists = await User.isUserExists(currentUserId);
  const userToFollowExists = await User.isUserExists(currentUserId);

  if (!currentUserExists || !userToFollowExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'One or both users not found');
  }

  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    // Use $pull to remove the user from the following/follower lists
    await Following.updateOne(
      { user: currentUserId },
      { $pull: { following: userToUnfollowId } },
      { upsert: true, session },
    );

    await Follower.updateOne(
      { user: userToUnfollowId },
      { $pull: { followers: currentUserId } },
      { upsert: true, session },
    );

    // Decrement the followersCount and followingCount in the User collection
    await User.findByIdAndUpdate(
      currentUserId,
      { $inc: { followingCount: -1 } },
      { session },
    );
    await User.findByIdAndUpdate(
      userToUnfollowId,
      { $inc: { followerCount: -1 } },
      { session },
    );

    await session.commitTransaction();
    session.endSession();

    return {
      message: 'User unfollowed successfully',
    };
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Failed to Unfollow user',
    );
  }
};

export const followServices = {
  followUserIntoDB,
  UnfollowUserIntoDB,
};
