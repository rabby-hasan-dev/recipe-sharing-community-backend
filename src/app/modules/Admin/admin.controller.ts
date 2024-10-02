import { RequestHandler } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';

import { AdminServices } from './admin.service';





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

export const AdminControllers = {
  getAllUsers,
  deleteUser,
  blockUser
};
