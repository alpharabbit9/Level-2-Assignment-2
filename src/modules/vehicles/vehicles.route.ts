import { Router } from 'express';
import { createVehicle, getAllVehicles, getVehicleById, updateVehicle, deleteVehicle } from './vehicles.controller';
import { protect } from '../../middlewares/authMiddleware';
import { restrictTo } from '../../middlewares/roleMiddleware';

const router = Router();

router.post('/', protect, restrictTo('admin'), createVehicle);
router.get('/', getAllVehicles);
router.get('/:vehicleId', getVehicleById);
router.put('/:vehicleId', protect, restrictTo('admin'), updateVehicle);
router.delete('/:vehicleId', protect, restrictTo('admin'), deleteVehicle);

export const vehiclesRoutes = router;
