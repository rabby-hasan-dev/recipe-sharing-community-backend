import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { initialPayment } from "../payment/payment.utils";
import { User } from "../User/user.model";
import { Subscription } from "./premium.model";

import moment from 'moment';

const createSubscriptionIntoDB = async (currentUserId: string, payload: any) => {

  const currentUserExists = await User.isUserExists(currentUserId);

  if (!currentUserExists) {
    throw new AppError(httpStatus.NOT_FOUND, " Current  users not found");
  }


  const { membershipType, price } = payload

  const duration = membershipType === 'monthly' ? 30 : 365;
  const startDate = new Date();
  const endDate = moment(startDate).add(duration, 'days').toDate();
  const transactionId = `TXN-${Date.now()}`;

  const subscribe = {
    userId: currentUserId,
    membershipType,
    status: 'pending', // Set status to pending until payment confirmation
    price,
    startDate,
    endDate,
    paymentDetails: {
      transactionId,
      paymentMethod: 'AAMARPAY'
    }
  }

  const paymentData = {
    transactionId,
    custormerName: currentUserExists.name?.firstName + ' ' + currentUserExists.name?.lastName,
    customerEmail: currentUserExists.email,
    customerAddress: 'default address',
    customerPhone: '01245966355',
    totalPrice: price
  }


  const subscription = await Subscription.create(subscribe);





  //user data get for payment info




  const paymentSession = await initialPayment(paymentData)

  console.log(paymentSession);

  return paymentSession;




};


// Update subscription status after payment confirmation
const updateSubscriptionStatus = async (subscriptionId: string, status: string) => {
  return await Subscription.findByIdAndUpdate(subscriptionId, { status }, { new: true });
};

// Check if the user's subscription is active
const isSubscriptionActive = async (currentUserId: string) => {
  const subscription = await Subscription.findOne({ currentUserId, status: 'active' });
  if (!subscription) return false;
  return moment(subscription.endDate).isAfter(new Date());
};




export const subscriptionService = {
  createSubscriptionIntoDB,
  updateSubscriptionStatus,
  isSubscriptionActive

};
