import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { subscriptionService } from './premium.service';



const purchaseSubscription = catchAsync(async (req, res) => {

  const purchaseData = req.body;
  const currentUserId = req.user.userId; // Assume user authentication is done

  const result = await subscriptionService.createSubscriptionIntoDB(currentUserId, purchaseData);


  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Subscription created successfully',
    data: result,
  });
});


const confirmPayment = catchAsync(async (req, res) => {

  const { subscriptionId } = req.body;

  const result = await subscriptionService.updateSubscriptionStatus(subscriptionId, 'active');

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Subscription activated successfully',
    data: result,
  });
});
const checkActiveSubscription = catchAsync(async (req, res) => {
  const currentUserId = req.user.userId;
  const result = await subscriptionService.isSubscriptionActive(currentUserId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Get subscription status check succesfully',
    data: result,
  });
});



export const subscriptionController = {
  confirmPayment,
  purchaseSubscription,
  checkActiveSubscription
};
