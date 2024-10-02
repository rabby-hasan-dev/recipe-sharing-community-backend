
import { z } from "zod";

export const SubscriptionZodSchema = z.object({
    body: z.object({
        membershipType: z.enum(['monthly', 'yearly']),
        status: z.enum(['active', 'expired', 'pending']).default('pending'),
        price: z.number().min(0, { message: "Price must be a positive number" }),
        startDate: z.date().default(new Date()),
        endDate: z.date(),
        paymentDetails: z.object({
            transactionId: z.string(),
            paymentMethod: z.enum(['AAMARPAY', 'Stripe']),
        }),
    })
});