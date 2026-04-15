import { Request, Response } from 'express';
import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/response';
import * as vehiclesService from './vehicles.service';

export const createVehicle = catchAsync(async (req: Request, res: Response) => {
  const vehicle = await vehiclesService.createVehicle(req.body);
  sendResponse(res, 201, {
    success: true,
    message: 'Vehicle created successfully',
    data: vehicle,
  });
});

export const getAllVehicles = catchAsync(async (req: Request, res: Response) => {
  const vehicles = await vehiclesService.getAllVehicles();
  sendResponse(res, 200, {
    success: true,
    message: 'Vehicles retrieved successfully',
    data: vehicles,
  });
});

export const getVehicleById = catchAsync(async (req: Request, res: Response) => {
  const vehicleId = parseInt(req.params.vehicleId as string, 10);
  const vehicle = await vehiclesService.getVehicleById(vehicleId);
  sendResponse(res, 200, {
    success: true,
    message: 'Vehicle retrieved successfully',
    data: vehicle,
  });
});

export const updateVehicle = catchAsync(async (req: Request, res: Response) => {
  const vehicleId = parseInt(req.params.vehicleId as string, 10);
  const updatedVehicle = await vehiclesService.updateVehicle(vehicleId, req.body);
  sendResponse(res, 200, {
    success: true,
    message: 'Vehicle updated successfully',
    data: updatedVehicle,
  });
});

export const deleteVehicle = catchAsync(async (req: Request, res: Response) => {
  const vehicleId = parseInt(req.params.vehicleId as string, 10);
  await vehiclesService.deleteVehicle(vehicleId);
  sendResponse(res, 200, {
    success: true,
    message: 'Vehicle deleted successfully',
  });
});
