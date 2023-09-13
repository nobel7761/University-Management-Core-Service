import { z } from 'zod';

const createBuildingZodValidation = z.object({
  body: z.object({
    title: z.string({ required_error: 'Title is required!' }),
  }),
});

const updateBuildingZodValidation = z.object({
  body: z.object({
    title: z.string({ required_error: 'Title is required!' }),
  }),
});

export const BuildingValidation = {
  createBuildingZodValidation,
  updateBuildingZodValidation,
};
