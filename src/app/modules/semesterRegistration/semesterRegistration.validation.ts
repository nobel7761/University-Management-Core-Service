import { SemesterRegistrationStatus } from '@prisma/client';
import { z } from 'zod';

const createSemesterRegistrationZodValidation = z.object({
  body: z.object({
    startDate: z.string({ required_error: 'Start Date is Required' }),
    endDate: z.string({ required_error: 'End Date is Required' }),
    minCredit: z.number({ required_error: 'Minimum Credit is Required' }),
    maxCredit: z.number({ required_error: 'Maximum Credit is Required' }),
    academicSemesterId: z.string({
      required_error: 'Academic Semester Id is Required!',
    }),
  }),
});

const updateSemesterRegistrationZodValidation = z.object({
  body: z.object({
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    status: z
      .enum(
        [...Object.values(SemesterRegistrationStatus)] as [string, ...string[]],
        {}
      )
      .optional(),
    minCredit: z.number().optional(),
    maxCredit: z.number().optional(),
    academicSemesterId: z.string().optional(),
  }),
});

export const SemesterRegistrationValidation = {
  createSemesterRegistrationZodValidation,
  updateSemesterRegistrationZodValidation,
};
