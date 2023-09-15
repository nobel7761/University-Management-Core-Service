import { z } from 'zod';

const createFacultyZodValidation = z.object({
  body: z.object({
    facultyId: z.string({ required_error: 'Faculty ID is required!' }),
    firstName: z.string({ required_error: 'First Name is required!' }),
    lastName: z.string({ required_error: 'Last Name is required!' }),
    middleName: z.string({ required_error: 'Middle Name is required!' }),
    profileImage: z.string({ required_error: 'Profile Image is required!' }),
    email: z.string({ required_error: 'Email is required!' }),
    contactNo: z.string({ required_error: 'Contact Number is required!' }),
    gender: z.string({ required_error: 'Gender is required!' }),
    bloodGroup: z.string({ required_error: 'Blood Group is required!' }),
    designation: z.string({ required_error: 'Designation is required!' }),
    academicDepartmentId: z.string({
      required_error: 'Academic Department ID is required!',
    }),
    academicFacultyId: z.string({
      required_error: 'Academic Faculty ID is required!',
    }),
  }),
});

const updateFacultyZodValidation = z.object({
  body: z.object({
    facultyId: z.string().optional(),
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    middleName: z.string().optional(),
    profileImage: z.string().optional(),
    email: z.string().optional(),
    contactNo: z.string().optional(),
    gender: z.string().optional(),
    bloodGroup: z.string().optional(),
    designation: z.string().optional(),
    academicDepartmentId: z.string().optional(),
    academicFacultyId: z.string().optional(),
  }),
});

const createAssignCourses = z.object({
  body: z.object({
    courses: z.array(z.string(), { required_error: 'Course Id is required!' }),
  }),
});

export const FacultyValidation = {
  createFacultyZodValidation,
  updateFacultyZodValidation,
  createAssignCourses,
};
