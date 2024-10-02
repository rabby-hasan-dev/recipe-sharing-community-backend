import express from 'express';
import { AdminControllers } from './admin.controller';
import auth from '../../middlewares/auth';
// import { UserRole } from '../User/user.constant';
import { USER_ROLE } from '../../constant';
import validateRequest from '../../middlewares/validateRequest';
import { AdminValidation } from './admin.validation';


const router = express.Router();

router.get('/users',
    // auth(USER_ROLE.admin || USER_ROLE.superAdmin),
    AdminControllers.getAllUsers);
router.put('/users/:userId/block',
    // auth(USER_ROLE.admin || USER_ROLE.superAdmin),
    validateRequest(AdminValidation.changeStatusValidationSchema),
    AdminControllers.blockUser);
router.delete('/users/:userId',
    auth(USER_ROLE.admin || USER_ROLE.superAdmin),
    AdminControllers.deleteUser);
// router.put('/recipes/:recipeId/publish', publishRecipe);
// router.delete('/recipes/:recipeId', deleteRecipeAdmin);




export const AdminRoutes = router;
