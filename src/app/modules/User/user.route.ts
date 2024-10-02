import express from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { USER_ROLE } from '../../constant';
import { UserControllers } from './user.controller';


const router = express.Router();

router.get('/me', auth(USER_ROLE.user), UserControllers.getMyProfile);
router.put('/me', auth(USER_ROLE.user),
    // validateRequest(updateUserValidationSchema),
    UserControllers.UpdateMyProfile);
router.get('/:userId', UserControllers.getSingleUser);
router.get('/',
    // auth(USER_ROLE.admin || USER_ROLE.superAdmin), 
    UserControllers.getAllUsers);
router.delete('/:userId',
    // auth(USER_ROLE.admin || USER_ROLE.user || USER_ROLE.superAdmin),
    UserControllers.deleteUser);

export const UsersRoutes = router;
