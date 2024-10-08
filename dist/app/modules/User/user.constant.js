"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserSearchableFields = exports.UserStatus = void 0;
exports.UserStatus = {
    ACTIVE: 'active',
    IN_PROGRESS: 'in-progress',
    BLOCKED: 'blocked',
};
exports.UserSearchableFields = [
    'email',
    'name.firstName',
    'name.lastName',
    'presentAddress',
];
