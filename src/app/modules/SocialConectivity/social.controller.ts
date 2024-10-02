import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { SocailConectivityServices } from './social.service';


// -------------- Rate Recpe section ---------

const rateRecipe = catchAsync(async (req, res) => {
  const currentUserId = req?.user?.userId;
  const rating = req.body;
  const { recipeId } = req.params


  const result = await SocailConectivityServices.rateRecipeIntoDB(currentUserId, recipeId, rating);

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

const getAvarageRecipeRatings = catchAsync(async (req, res) => {
  const { recipeId } = req.params;

  const result = await SocailConectivityServices.getAvarageRecipeRatingsFromDB(recipeId);

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
  const { recipeId, commentId } = req.params;
  const { comment } = req.body

  const result = await SocailConectivityServices.editRecipeCommentFromDB(recipeId, commentId, comment);

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

const upvoteRecipe = catchAsync(async (req, res) => {
  const { recipeId } = req.params;
  const currentUserId = req?.user?.userId;

  const result = await SocailConectivityServices.upvoteRecipeIntoDB(recipeId, currentUserId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'upvote succesfully',
    data: result,
  });
});

const downvoteRecipe = catchAsync(async (req, res) => {
  const { recipeId } = req.params;
  const currentUserId = req?.user?.userId;
  const result = await SocailConectivityServices.downvoteRecipeIntoDB(recipeId, currentUserId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'dwon vote succesfully',
    data: result,
  });
});

const getvotes = catchAsync(async (req, res) => {
  const { recipeId } = req.params;

  const result = await SocailConectivityServices.getvotesFromDB(recipeId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'get vote ratting succesfully',
    data: result,
  });
});


export const SocailConectivityControllers = {
  rateRecipe,
  getRecipeRatings,
  getAvarageRecipeRatings,
  postRecipeComment,
  getRecipeComment,
  editeRecipeComment,
  deleteRecipeComment,
  upvoteRecipe,
  downvoteRecipe,
  getvotes
};
