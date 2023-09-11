import { z } from 'zod';

const createAcademicSemesterZodValidation = z.object({
  body: z.object({
    year: z.number({ required_error: 'Year is required!' }),
    title: z.string({ required_error: 'Title is required!' }),
    code: z.string({ required_error: 'Code is required!' }),
    startMonth: z.string({ required_error: 'Start Month is required!' }),
    endMonth: z.string({ required_error: 'End Month is required!' }),
  }),
});

const updateAcademicSemesterZodValidation = z.object({
  body: z.object({
    year: z.number().optional(),
    title: z.string().optional(),
    code: z.string().optional(),
    startMonth: z.string().optional(),
    endMonth: z.string().optional(),
  }),
});

export const AcademicSemesterValidation = {
  createAcademicSemesterZodValidation,
  updateAcademicSemesterZodValidation,
};
