import { z } from 'zod';

const createRoomZodValidation = z.object({
  body: z.object({
    roomNumber: z.string({ required_error: 'Room Number is required!' }),
    floor: z.string({ required_error: 'Floor is required!' }),
    buildingId: z.string({ required_error: 'Building ID is required!' }),
  }),
});

const updateRoomZodValidation = z.object({
  body: z.object({
    roomNumber: z.string().optional(),
    floor: z.string().optional(),
    buildingId: z.string().optional(),
  }),
});

export const RoomValidation = {
  createRoomZodValidation,
  updateRoomZodValidation,
};
