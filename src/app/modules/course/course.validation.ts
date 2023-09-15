import { z } from 'zod';

const createCourseZodValidation = z.object({
  body: z.object({
    title: z.string({ required_error: 'Title is required!' }),
    code: z.string({ required_error: 'Course Code is required!' }),
    credit: z.number({ required_error: 'Course Credit is required!' }),
  }),
});

const updateCourseZodValidation = z.object({
  body: z.object({
    title: z.string().optional(),
    code: z.string().optional(),
    credit: z.number().optional(),
  }),
});

const createAssignFaculties = z.object({
  body: z.object({
    faculties: z.array(z.string({ required_error: 'Faculty Id is required!' })),
  }),
});

export const CourseValidation = {
  createCourseZodValidation,
  updateCourseZodValidation,
  createAssignFaculties,
};
