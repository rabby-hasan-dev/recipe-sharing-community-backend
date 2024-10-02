import httpStatus from "http-status";
import AppError from "../../errors/AppError";

import { Follower, Following } from "./follow.model";
import { User } from "../User/user.model";



const followUserIntoDB = async (currentUserId: any, userToFollowId: any) => {

  if (currentUserId === userToFollowId) {
    throw new AppError(httpStatus.BAD_REQUEST, "You cannot follow yourself");
  }

  const currentUserExists = await User.isUserExists(currentUserId);
  const userToFollowExists = await User.isUserExists(currentUserId);

  if (!currentUserExists || !userToFollowExists) {
    throw new AppError(httpStatus.NOT_FOUND, "One or both users not found");
  }


  // Use $addToSet to ensure no duplicates are added
  await Following.updateOne(
    { user: currentUserId },
    { $addToSet: { following: userToFollowId } },
    { upsert: true }  // Create if it doesn't exist
  );

  await Follower.updateOne(
    { user: userToFollowId },
    { $addToSet: { followers: currentUserId } },
    { upsert: true }
  );

  return { message: "User followed successfully" };



};


const UnfollowUserIntoDB = async (currentUserId: any, userToUnfollowId: any) => {

  if (currentUserId === userToUnfollowId) {
    throw new AppError(httpStatus.BAD_REQUEST, "You cannot Unfollow yourself");
  }

  const currentUserExists = await User.isUserExists(currentUserId);
  const userToFollowExists = await User.isUserExists(currentUserId);

  if (!currentUserExists || !userToFollowExists) {
    throw new AppError(httpStatus.NOT_FOUND, "One or both users not found");
  }

  // Use $pull to remove the user from the following/follower lists
  await Following.updateOne(
    { user: currentUserId },
    { $pull: { following: userToUnfollowId } }
  );

  await Follower.updateOne(
    { user: userToUnfollowId },
    { $pull: { followers: currentUserId } }
  );

  return { message: "User unfollowed successfully" };
}




// fllow and following count

const getFollowerCountFromDB = async (userId: string) => {
  const follower = await Follower.findOne({ user: userId }).select("followers");
  return follower ? follower.followers.length : 0;
};

const getFollowingCountFromDB = async (userId: string) => {
  const following = await Following.findOne({ user: userId }).select("following");
  return following ? following.following.length : 0;
};




export const followServices = {

  followUserIntoDB,
  UnfollowUserIntoDB,
  getFollowerCountFromDB,
  getFollowingCountFromDB
};

