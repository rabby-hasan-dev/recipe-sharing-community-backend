"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserStatusEnum = exports.UserRoleEnum = void 0;
var UserRoleEnum;
(function (UserRoleEnum) {
    UserRoleEnum["SUPER_ADMIN"] = "superAdmin";
    UserRoleEnum["ADMIN"] = "admin";
    UserRoleEnum["USER"] = "user";
})(UserRoleEnum || (exports.UserRoleEnum = UserRoleEnum = {}));
var UserStatusEnum;
(function (UserStatusEnum) {
    UserStatusEnum["ACTIVE"] = "active";
    UserStatusEnum["IN_PROGRESS"] = "in-progress";
    UserStatusEnum["BLOCKED"] = "blocked";
})(UserStatusEnum || (exports.UserStatusEnum = UserStatusEnum = {}));
