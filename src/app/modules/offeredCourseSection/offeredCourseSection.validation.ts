import { z } from 'zod';

const createOfferedCourseSectionZodValidation = z.object({
  body: z.object({
    title: z.string({ required_error: 'Title is Required!' }),
    maxCapacity: z.number({ required_error: 'Max Capacity is Required!' }),
    offeredCourseId: z.string({
      required_error: 'Offered Course Id is Required!',
    }),
  }),
});

const updateOfferedCourseSectionZodValidation = z.object({
  body: z.object({
    title: z.string().optional(),
    maxCapacity: z.number().optional(),
  }),
});

export const OfferedCourseSectionValidation = {
  createOfferedCourseSectionZodValidation,
  updateOfferedCourseSectionZodValidation,
};
