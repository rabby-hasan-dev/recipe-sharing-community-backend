import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { SocailConectivityServices } from './social.service';


// -------------- Rate Recpe section ---------

const rateRecipe = catchAsync(async (req, res) => {
  const currentUserId = req?.user?.userId;
  const { rating } = req.body;
  const { recipeId } = req.params
  const result = await SocailConectivityServices.rateAndCalculateAverage(currentUserId, recipeId, rating);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'rate recipe succesfully',
    data: result,
  });
});



const getRecipeRatings = catchAsync(async (req, res) => {
  const { recipeId } = req.params;

  const result = await SocailConectivityServices.getRecipeRatingsFromDB(recipeId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'get recipe ratting succesfully',
    data: result,
  });
});


// -------------- Comment Recpe section ---------

const postRecipeComment = catchAsync(async (req, res) => {
  const currentUserId = req?.user?.userId;
  const { comment } = req.body;
  const { recipeId } = req.params;

  const result = await SocailConectivityServices.postRecipeCommentIntoDB(currentUserId, recipeId, comment);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Post Recipe comment succesfully',
    data: result,
  });
});

const getRecipeComment = catchAsync(async (req, res) => {
  const { recipeId } = req.params;

  const result = await SocailConectivityServices.getRecipeCommentFromDB(recipeId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Get Recipe commentg succesfully',
    data: result,
  });
});

const editeRecipeComment = catchAsync(async (req, res) => {
  const { userId } = req.user;
  const { commentId } = req.params;
  const { comment } = req.body

  const result = await SocailConectivityServices.editRecipeCommentFromDB(userId, commentId, comment);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Edit Recipe comment succesfully',
    data: result,
  });
});

const deleteRecipeComment = catchAsync(async (req, res) => {
  const { recipeId, commentId } = req.params;

  const result = await SocailConectivityServices.deleteRecipeCommentFromDB(recipeId, commentId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Delete Recipe comment succesfully',
    data: result,
  });
});


// -------------- Vote Recpe section ---------

const toggleVoteRecipe = catchAsync(async (req, res) => {
  const { recipeId } = req.params;
  const currentUserId = req?.user?.userId;
  const voteType = req?.body?.type;


  const result = await SocailConectivityServices.toggleVote(recipeId, currentUserId, voteType);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Vote Recipe succesfully',
    data: result,
  });
});




export const SocailConectivityControllers = {
  rateRecipe,
  getRecipeRatings,
  postRecipeComment,
  getRecipeComment,
  editeRecipeComment,
  deleteRecipeComment,
  toggleVoteRecipe,
};
