import express from 'express';

import { USER_ROLE } from '../../constant';
import { subscriptionController } from './premium.controller';
import auth from '../../middlewares/auth';




const router = express.Router();


// Route to purchase a new subscription
router.post('/purchase', auth(USER_ROLE.user), subscriptionController.purchaseSubscription);
// Route to confirm payment
router.post('/confirm', auth(USER_ROLE.user), subscriptionController.confirmPayment);
// Route to check if the user has an active subscription
router.get('/active', subscriptionController.checkActiveSubscription);


export const PremiumRoutes = router;