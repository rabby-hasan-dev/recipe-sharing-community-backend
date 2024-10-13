import { RequestHandler } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';
import { FeedService } from './feed.service';

const getAllPublicRecipes: RequestHandler = catchAsync(async (req, res) => {
  const result = await FeedService.getAllPublicRecipeFromDB(req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Public Recipe Get Succesfully',
    meta: result.meta,
    data: result.result,
  });
});

const getAllPrimiumRecipes: RequestHandler = catchAsync(async (req, res) => {
  const result = await FeedService.getAllPrimiumRecipeFromDB(req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Preimium Recipe Get Succesfully',
    meta: result.meta,
    data: result.result,
  });
});

export const FeedController = {
  getAllPublicRecipes,
  getAllPrimiumRecipes,
};
