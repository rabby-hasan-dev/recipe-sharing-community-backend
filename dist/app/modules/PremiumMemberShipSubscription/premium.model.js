"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Subscription = void 0;
const mongoose_1 = require("mongoose");
const subscriptionSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    membershipType: {
        type: String,
        enum: ['monthly', 'yearly'], // You can define more plans here
        required: true,
        trim: true
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
}, {
    timestamps: true,
});
exports.Subscription = (0, mongoose_1.model)('Subscription', subscriptionSchema);
