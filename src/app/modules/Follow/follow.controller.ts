import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { followServices } from './follow.service';

const followUser = catchAsync(async (req, res) => {
  const currentUserId = req?.user?.userId;
  const userToFollowId = req.params.userId;

  const result = await followServices.followUserIntoDB(
    currentUserId,
    userToFollowId,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Follow User succesfully',
    data: result,
  });
});

const unfollowUser = catchAsync(async (req, res) => {
  const currentUserId = req?.user?.userId;
  const userToFollowId = req.params.userId;

  const result = await followServices.UnfollowUserIntoDB(
    currentUserId,
    userToFollowId,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Unfollow User succesfully',
    data: result,
  });
});

export const followController = {
  followUser,
  unfollowUser,
  // getFollowerCount,
  // getFollowingCount
};
