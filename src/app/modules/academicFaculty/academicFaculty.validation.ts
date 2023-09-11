import { z } from 'zod';

const createAcademicFacultyZodValidation = z.object({
  body: z.object({
    title: z.string({ required_error: 'Title is required!' }),
  }),
});

const updateAcademicFacultyZodValidation = z.object({
  body: z.object({
    title: z.string().optional(),
  }),
});

export const AcademicFacultyValidation = {
  createAcademicFacultyZodValidation,
  updateAcademicFacultyZodValidation,
};
