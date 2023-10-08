import { z } from 'zod';

const createCourseZodValidation = z.object({
  body: z.object({
    title: z.string({ required_error: 'Title is required!' }),
    code: z.string({ required_error: 'Course Code is required!' }),
    credit: z.number({ required_error: 'Course Credit is required!' }),
    preRequisiteCourses: z
      .array(
        z.object({
          courseId: z.string({}),
        })
      )
      .optional(),
  }),
});

const updateCourseZodValidation = z.object({
  body: z.object({
    title: z.string().optional(),
    code: z.string().optional(),
    credit: z.number().optional(),
    preRequisiteCourses: z
      .array(
        z.object({
          courseId: z.string({}),
          isDeleted: z.boolean({}).optional(),
        })
      )
      .optional(),
  }),
});

const assignOrRemoveFaculties = z.object({
  body: z.object({
    faculties: z.array(z.string({ required_error: 'Faculty Id is required!' })),
  }),
});

export const CourseValidation = {
  createCourseZodValidation,
  updateCourseZodValidation,
  assignOrRemoveFaculties,
};
