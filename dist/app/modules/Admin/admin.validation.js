"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminValidation = void 0;
const zod_1 = require("zod");
const changeStatusValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        status: zod_1.z.enum(['in-progress', 'active', 'blocked']),
    }),
});
exports.AdminValidation = {
    changeStatusValidationSchema,
};
