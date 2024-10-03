
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
  followerCount: number;
  followingCount: number;
  isPremium: boolean;
  membershipExpiration: Date;
  isDeleted: boolean;



}

export interface UserModel extends Model<TUser> {
  //instance methods for checking if the user exist
  isUserExists(id: string): Promise<TUser>;
  isUserExistsByEmail(email: string): Promise<TUser>;

  //instance methods for checking if passwords are matched
  isPasswordMatched(
    plainTextPassword: string,
    hashedPassword: string,
  ): Promise<boolean>;

  isJWTIssuedBeforePasswordChanged(
    passwordChangedTimestamp: Date,
    jwtIssuedTimestamp: number,
  ): boolean;
}

export type TUserRole = keyof typeof USER_ROLE;
