import express from 'express';

import { USER_ROLE } from '../../constant';
import { subscriptionController } from './premium.controller';
import auth from '../../middlewares/auth';

const router = express.Router();

// Route to purchase a new subscription
router.post(
  '/purchase',
  auth(USER_ROLE.user),
  subscriptionController.purchaseSubscription,
);
// Route to confirm payment
router.post('/confirm', subscriptionController.confirmPayment);
// Route to check if the user has an active subscription
router.get(
  '/active',
  auth(USER_ROLE.user, USER_ROLE.admin, USER_ROLE.superAdmin),
  subscriptionController.checkActiveSubscription,
);
router.get(
  '/subscriber',
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  subscriptionController.getAllSubscriberMember,
);

export const PremiumRoutes = router;
