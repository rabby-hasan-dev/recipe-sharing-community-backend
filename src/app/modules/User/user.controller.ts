import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { UserRegisterServices } from './user.service';

const createUser = catchAsync(async (req, res) => {
  const data = req.body;
  const file = req.file;

  const result = await UserRegisterServices.createUserIntoDB(file!, data);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User is created succesfully',
    data: result,
  });
});

const createAdmin = catchAsync(async (req, res) => {
  const data = req.body;
  const file = req.file;


  const result = await UserRegisterServices.createAdminIntoDB(file!, data);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Admin is created succesfully',
    data: result,
  });
});

export const UserRegisterControllers = {
  createUser,
  createAdmin,
};
