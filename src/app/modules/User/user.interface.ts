
import { Model, Types } from 'mongoose';
import { USER_ROLE } from '../../constant';
import { UserRole, UserStatus } from './user.constant';

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
  role: UserRole;
  isVerified: boolean;
  status: UserStatus;
  profilePicture?: string;
  bio?: string;
  followers?: Types.ObjectId[];
  following?: Types.ObjectId[];
  isPremium: boolean;
  membershipExpiration?: Date;
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
