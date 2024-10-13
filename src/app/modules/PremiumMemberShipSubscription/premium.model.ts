import { model, Schema } from 'mongoose';
import { ISubscription } from './premium.interface';

const subscriptionSchema = new Schema<ISubscription>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    membershipType: {
      type: String,
      enum: ['monthly', 'yearly'], // You can define more plans here
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ['active', 'expired', 'pending'],
      default: 'pending',
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
    },
    startDate: {
      type: Date,
      default: Date.now,
    },
    endDate: {
      type: Date,
      required: true,
    },
    paymentDetails: {
      transactionId: String,
      paymentMethod: {
        type: String,
        enum: ['AAMARPAY', 'Stripe'], // Payment methods
        required: true,
      },
    },
  },
  {
    timestamps: true,
  },
);

export const Subscription = model<ISubscription>(
  'Subscription',
  subscriptionSchema,
);
