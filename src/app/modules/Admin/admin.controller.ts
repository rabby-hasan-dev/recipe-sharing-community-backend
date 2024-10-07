import { RequestHandler } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';

import { AdminServices } from './admin.service';
import { USER_ROLE } from '../../constant';

const getAllUsers: RequestHandler = catchAsync(async (req, res) => {
  const result = await AdminServices.getAllUsersFromDB(req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User are retrieved succesfully',
    meta: result.meta,
    data: result.result,
  });
});

const blockUser = catchAsync(async (req, res) => {
  const { userId } = req.params;
  const updateStatus = req.body;
  const result = await AdminServices.blockUserIntoDB(userId, updateStatus);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: '  User is Block succesfully',
    data: result,
  });
});

const createAdmin = catchAsync(async (req, res) => {
  const { userId, role } = req.body;
  const result = await AdminServices.createAdminIntoDB(userId, role);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: `${role === USER_ROLE.admin ? 'Admin' : 'User'} is created succesfully`,
    data: result,
  });
});

const deleteUser = catchAsync(async (req, res) => {
  const { userId } = req.params;
  const result = await AdminServices.deleteUserFromDB(userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User is deleted succesfully',
    data: result,
  });
});

const publishRecipe = catchAsync(async (req, res) => {
  const recipeId = req.body.id;
  const result = await AdminServices.deleteUserFromDB(recipeId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'publish Recipe  succesfully',
    data: result,
  });
});

export const AdminControllers = {
  getAllUsers,
  deleteUser,
  blockUser,
  createAdmin,
  publishRecipe,
};
