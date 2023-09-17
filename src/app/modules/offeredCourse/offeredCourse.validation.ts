import { z } from 'zod';

const createOfferedCourseZodValidation = z.object({
  body: z.object({
    courseId: z.array(
      z.string({
        required_error: 'Course Id is Required!',
      }),
      { required_error: 'Course Ids are Required!' }
    ),
    academicDepartmentId: z.string({
      required_error: 'Academic Department Id is Required!',
    }),
    semesterRegistrationId: z.string({
      required_error: 'Semester Registration Id is Required!',
    }),
  }),
});

const updateOfferedCourseZodValidation = z.object({
  body: z.object({
    courseId: z.array(z.string()).optional(),
    academicDepartmentId: z.string().optional(),
    semesterRegistrationId: z.string().optional(),
  }),
});

export const OfferedCourseValidation = {
  createOfferedCourseZodValidation,
  updateOfferedCourseZodValidation,
};
