import { z } from 'zod';

const createAcademicDepartmentZodValidation = z.object({
  body: z.object({
    title: z.string({ required_error: 'Title is required!' }),
    academicFacultyId: z.string({
      required_error: 'Academic Faculty ID is required!',
    }),
  }),
});

const updateAcademicDepartmentZodValidation = z.object({
  body: z.object({
    title: z.string().optional(),
    academicFacultyId: z.string().optional(),
  }),
});

export const AcademicDepartmentValidation = {
  createAcademicDepartmentZodValidation,
  updateAcademicDepartmentZodValidation,
};
