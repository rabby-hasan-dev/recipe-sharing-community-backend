import { Model, Types } from 'mongoose';
import { USER_ROLE } from '../../constant';

export enum UserRoleEnum {
  SUPER_ADMIN = 'superAdmin',
  ADMIN = 'admin',
  USER = 'user',
}

export enum UserStatusEnum {
  ACTIVE = 'active',
  IN_PROGRESS = 'in-progress',
  BLOCKED = 'blocked',
}

export type TUserName = {
  firstName: string;
  lastName: string;
};

export interface TUser {
  _id?: Types.ObjectId | String;
  username: string;
  name?: TUserName;
  email: string;
  password: string;
  needsPasswordChange: boolean;
  passwordChangedAt?: Date;
  role: UserRoleEnum;
  isVerified: boolean;
  status: UserStatusEnum;
  profilePicture: string;
  bio: string;
  phone: string;
  address: string;
  followerCount: number;
  followingCount: number;
  isPremium: boolean;
  premiumExpiresAt: Date;
  isDeleted: boolean;
}

export interface UserModel extends Model<TUser> {
  //instance methods for checking if the user exist
  // eslint-disable-next-line no-unused-vars
  isUserExists(id: string): Promise<TUser>;
  isUserExistsByEmail(email: string): Promise<TUser>;

  //instance methods for checking if passwords are matched
  // eslint-disable-next-line no-unused-vars
  isPasswordMatched(
    plainTextPassword: string,
    hashedPassword: string,
  ): Promise<boolean>;
  // eslint-disable-next-line no-unused-vars
  isJWTIssuedBeforePasswordChanged(
    passwordChangedTimestamp: Date,
    jwtIssuedTimestamp: number,
  ): boolean;
}

export type TUserRole = keyof typeof USER_ROLE;
