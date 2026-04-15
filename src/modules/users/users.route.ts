import { Router } from 'express';
import { getAllUsers, updateUser, deleteUser } from './users.controller';
import { protect } from '../../middlewares/authMiddleware';
import { restrictTo } from '../../middlewares/roleMiddleware';

const router = Router();

router.get('/', protect, restrictTo('admin'), getAllUsers);
router.put('/:userId', protect, updateUser);
router.delete('/:userId', protect, restrictTo('admin'), deleteUser);

export const usersRoutes = router;
