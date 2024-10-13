import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { User } from '../User/user.model';
import { Subscription } from './premium.model';
import moment from 'moment';
import {
  initialPayment,
  verifyPayment,
  renderPaymentFailureTemplate,
  renderPaymentSuccessTemplate,
} from './premium.utils';
import mongoose from 'mongoose';

const createSubscriptionIntoDB = async (
  currentUserId: string,
  { membershipType, price }: { membershipType: string; price: number },
) => {
  const currentUser = await User.isUserExists(currentUserId);

  if (!currentUser) {
    throw new AppError(httpStatus.NOT_FOUND, ' Current  users not found');
  }

  // Validate membership type
  if (!['monthly', 'yearly'].includes(membershipType)) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Invalid membership type');
  }

  // Set subscription details
  const durationInDays = membershipType === 'monthly' ? 30 : 365;
  const startDate = new Date();
  const endDate = moment(startDate).add(durationInDays, 'days').toDate();
  const transactionId = `TXN-${Date.now()}`;

  // Create subscription
  await Subscription.create({
    userId: currentUserId,
    membershipType,
    status: 'pending',
    price,
    startDate,
    endDate,
    paymentDetails: {
      transactionId,
      paymentMethod: 'AAMARPAY',
    },
  });

  // Prepare payment data
  const paymentData = {
    transactionId,
    customerName: `${currentUser.name?.firstName}  ${currentUser.name?.lastName}`,
    customerEmail: currentUser.email,
    customerAddress: currentUser.address || 'default address',
    customerPhone: currentUser.phone || '01245966355',
    totalPrice: price,
  };

  //user data get for payment info
  const paymentSession = await initialPayment(paymentData);
  return paymentSession;
};

const paymentConfirmationService = async (
  transactionId: string,
  status: string,
) => {
  const verifyResponse = await verifyPayment(transactionId);

  if (!verifyResponse || verifyResponse.pay_status !== 'Successful') {
    return await renderPaymentFailureTemplate(); // Handle failure case early
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // update subcription payment  status
    await Subscription.findOneAndUpdate(
      { 'paymentDetails.transactionId': transactionId },
      { status: 'active' },
      { new: true, session },
    );

    //  Expiration date retirive from sunscription
    const expirationDate = await Subscription.findOne({
      'paymentDetails.transactionId': transactionId,
    });
    // update user memberShip confirm  status
    await User.findOneAndUpdate(
      { email: verifyResponse?.cus_email },
      { isPremium: true, premiumExpiresAt: expirationDate?.endDate },
      { new: true, session },
    );

    await session.commitTransaction();

    //  extract payment  info
    const extractPaymentData = {
      consumerName: verifyResponse?.cus_name,
      email: verifyResponse?.cus_email,
      phone: verifyResponse?.cus_phone,
      transactionId: verifyResponse?.mer_txnid,
      amount: verifyResponse?.amount,
      currency: 'BDT',
      payment_type: verifyResponse?.payment_type,
      payTime: verifyResponse?.date,
      paymentStatus: verifyResponse?.pay_status,
    };

    // Render template based on the passed `status`
    if (extractPaymentData && status === 'success') {
      return await renderPaymentSuccessTemplate(extractPaymentData);
    } else if (status === 'fail') {
      return await renderPaymentFailureTemplate();
    }
  } catch (error: unknown) {
    await session.abortTransaction();
    if (error instanceof Error) {
      throw new AppError(
        httpStatus.INTERNAL_SERVER_ERROR,
        `Payment confirmation failed: ${error.message}`,
      );
    } else {
      throw new AppError(
        httpStatus.INTERNAL_SERVER_ERROR,
        'Payment confirmation failed due to an unknown error.',
      );
    }
  } finally {
    await session.endSession();
  }
};

// Check if the user's subscription is active
const isSubscriptionActive = async (currentUserId: string) => {
  const subscription = await Subscription.findOne({
    currentUserId,
    status: 'active',
  });
  if (!subscription) return false;
  return moment(subscription.endDate).isAfter(new Date());
};

// Check if the user's subscription is active
const getSubscriberMemberIntoDB = async () => {
  const subscription = await Subscription.find({});
  return subscription;
};

export const subscriptionService = {
  createSubscriptionIntoDB,
  paymentConfirmationService,
  isSubscriptionActive,
  getSubscriberMemberIntoDB,
};
