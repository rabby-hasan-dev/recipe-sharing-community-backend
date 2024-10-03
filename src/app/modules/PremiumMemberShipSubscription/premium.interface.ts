import { Types } from 'mongoose';

export interface ISubscription {
  userId: Types.ObjectId;
  membershipType: 'monthly' | 'yearly';
  status: 'active' | 'expired' | 'pending';
  price: number;
  startDate: Date;
  endDate: Date;
  paymentDetails: {
    transactionId: string;
    paymentMethod: 'AAMARPAY' | 'Stripe';
  };
}
