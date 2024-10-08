"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscriptionZodSchema = void 0;
const zod_1 = require("zod");
exports.SubscriptionZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        membershipType: zod_1.z.enum(['monthly', 'yearly']),
        status: zod_1.z.enum(['active', 'expired', 'pending']).default('pending'),
        price: zod_1.z.number().min(0, { message: 'Price must be a positive number' }),
        startDate: zod_1.z.date().default(new Date()),
        endDate: zod_1.z.date(),
        paymentDetails: zod_1.z.object({
            transactionId: zod_1.z.string(),
            paymentMethod: zod_1.z.enum(['AAMARPAY', 'Stripe']),
        }),
    }),
});
