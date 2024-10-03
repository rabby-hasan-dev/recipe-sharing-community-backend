/* eslint-disable @typescript-eslint/no-this-alias */
import bcrypt from 'bcrypt';
import { Schema, model } from 'mongoose';
import config from '../../config';
import { TUser, TUserName, UserModel, UserRoleEnum, UserStatusEnum } from './user.interface';
import { number } from 'zod';
// import { UserRole, UserStatus } from './user.constant';


const userNameSchema = new Schema<TUserName>({
  firstName: {
    type: String,
    required: [true, 'First Name is required'],
    trim: true,
    maxlength: [20, 'Name can not be more than 20 characters'],
  },
  lastName: {
    type: String,
    trim: true,
    required: [true, 'Last Name is required'],
    maxlength: [20, 'Name can not be more than 20 characters'],
  },
});


const userSchema = new Schema<TUser, UserModel>(
  {

    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    name: {
      type: userNameSchema,

    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },

    needsPasswordChange: {
      type: Boolean,
      default: true,
    },
    passwordChangedAt: {
      type: Date,
    },
    role: {
      type: String,
      enum: UserRoleEnum,
      default: UserRoleEnum.USER,
      required: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: UserStatusEnum,
      default: UserStatusEnum.IN_PROGRESS,
    },
    profilePicture: {
      type: String,
      default: '',
    },
    phone: {
      type: String,
      default: '',
    },
    address: {
      type: String,
      default: '',
    },

    followerCount: { type: Number, default: 0 },
    followingCount: { type: Number, default: 0 },

    isPremium: {
      type: Boolean,
      default: false, // indicates premium membership
    },
    membershipExpiration: {
      type: Date, // expiration date for premium membership
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },


  },
  {
    timestamps: true,
  },
);

userSchema.pre('save', async function (next) {
  const user = this; // doc
  // hashing password and save into DB
  user.password = await bcrypt.hash(
    user.password,
    Number(config.bcrypt_salt_rounds),
  );
  next();
});

// set '' after saving password
userSchema.post('save', function (doc, next) {
  doc.password = '';
  next();
});


userSchema.statics.isUserExists = async function (id: string) {
  return await User.findById(id).select('+password');
};

userSchema.statics.isUserExistsByEmail = async function (email: string) {
  return await User.findOne({ email }).select('+password');
};

userSchema.statics.isPasswordMatched = async function (
  plainTextPassword,
  hashedPassword,
) {
  return await bcrypt.compare(plainTextPassword, hashedPassword);
};

userSchema.statics.isJWTIssuedBeforePasswordChanged = function (
  passwordChangedTimestamp: Date,
  jwtIssuedTimestamp: number,
) {
  const passwordChangedTime =
    new Date(passwordChangedTimestamp).getTime() / 1000;
  return passwordChangedTime > jwtIssuedTimestamp;
};




export const User = model<TUser, UserModel>('User', userSchema);
