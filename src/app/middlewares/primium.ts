import { RequestHandler } from 'express';
import catchAsync from '../utils/catchAsync';
import { User } from '../modules/User/user.model';
import AppError from '../errors/AppError';

const verifyPremium: RequestHandler = catchAsync(async (req, res, next) => {
  const { userId } = req.user;

  const user = await User.isUserExists(userId);

  if (!user || !user.isPremium) {
    throw new AppError(
      403,
      'You need a premium subscription to access this content.',
    );
  }

  if (new Date() > new Date(user.premiumExpiresAt)) {
    throw new AppError(403, 'Your premium subscription has expired.');
  }

  next();
});

export default verifyPremium;
