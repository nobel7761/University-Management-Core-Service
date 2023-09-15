import { z } from 'zod';

const create = z.object({
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

export const SemesterRegistrationValidation = {
  create,
};
