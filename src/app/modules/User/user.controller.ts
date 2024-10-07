
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { UserServices } from './user.service';

const getMyProfile = catchAsync(async (req, res) => {
  const { email, role } = req.user;
  const result = await UserServices.getMyProfileIntoDB(email, role);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'My Update succesfully',
    data: result,
  });
});

const UpdateMyProfile = catchAsync(async (req, res) => {
  const user = req.user;
  const payload = req.body;
  const file = req.file;
  const result = await UserServices.updateUserDataIntoDB(user, payload, file!);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'My Profile Get succesfully',
    data: result,
  });
});

const getSingleUser = catchAsync(async (req, res) => {
  const { userId } = req.params;
  const result = await UserServices.getSingleUserFromDB(userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User is retrieved succesfully',
    data: result,
  });
});



export const UserControllers = {
  UpdateMyProfile,
  getMyProfile,
  getSingleUser,

};
