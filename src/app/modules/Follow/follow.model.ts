import { model, Schema } from 'mongoose';
import { IFollower, IFollowing } from './follow.interface';

const followerSchema = new Schema<IFollower>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    followers: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  {
    timestamps: true,
  },
);

followerSchema.index({ user: 1 }); // Index for quick lookup

const followingSchema = new Schema<IFollowing>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    following: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  {
    timestamps: true,
  },
);

followingSchema.index({ user: 1 }); // Index for quick lookup

export const Follower = model<IFollower>('Follower', followerSchema);
export const Following = model<IFollowing>('Following', followingSchema);
