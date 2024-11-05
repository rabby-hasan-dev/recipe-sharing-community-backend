"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserValidation = void 0;
const zod_1 = require("zod");
const userNameSchema = zod_1.z.object({
    firstName: zod_1.z
        .string()
        .min(1, 'First Name is required')
        .max(20, 'Name cannot be more than 20 characters')
        .trim(),
    lastName: zod_1.z
        .string()
        .min(1, 'Last Name is required')
        .max(20, 'Name cannot be more than 20 characters')
        .trim(),
});
const userUpdateNameSchema = zod_1.z.object({
    firstName: zod_1.z
        .string()
        .min(1, 'First Name is required')
        .max(20, 'Name cannot be more than 20 characters')
        .trim()
        .optional(),
    lastName: zod_1.z
        .string()
        .min(1, 'Last Name is required')
        .max(20, 'Name cannot be more than 20 characters')
        .trim()
        .optional(),
});
// const imageFileSchema = z.object({
//   fieldname: z.string().min(1, 'Fieldname is required'),
//   originalname: z.string().min(1, 'Original name is required'),
//   encoding: z.string().min(1, 'Encoding is required'),
//   mimetype: z.string().min(1, 'Mimetype is required'),
//   path: z.string().min(1, 'Path is required'),
//   size: z.number().min(1, 'File size must be greater than 0'),
//   filename: z.string().min(1, 'Filename is required'),
// });
const userValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        username: zod_1.z.string().min(1, 'Username is required').trim(),
        email: zod_1.z
            .string()
            .email('Invalid email format')
            .min(1, 'Email is required')
            .trim(),
        password: zod_1.z
            .string()
            .min(1, 'Password is required')
            .max(20, { message: 'Password can not be more than 20 characters' })
            .trim()
            .optional(),
    }),
});
const userUpdateValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: userUpdateNameSchema.optional(),
        bio: zod_1.z.string().optional(),
        phone: zod_1.z.string().optional(),
        address: zod_1.z.string().optional(),
    }),
});
const changeStatusValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        status: zod_1.z.enum(['in-progress', 'active', 'blocked']),
    }),
});
exports.UserValidation = {
    userValidationSchema,
    changeStatusValidationSchema,
    userUpdateValidationSchema,
};
