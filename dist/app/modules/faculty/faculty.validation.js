"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FacultyValidation = void 0;
const zod_1 = require("zod");
const createFacultyZodValidation = zod_1.z.object({
    body: zod_1.z.object({
        facultyId: zod_1.z.string({ required_error: 'Faculty ID is required!' }),
        firstName: zod_1.z.string({ required_error: 'First Name is required!' }),
        lastName: zod_1.z.string({ required_error: 'Last Name is required!' }),
        middleName: zod_1.z.string({ required_error: 'Middle Name is required!' }),
        profileImage: zod_1.z.string({ required_error: 'Profile Image is required!' }),
        email: zod_1.z.string({ required_error: 'Email is required!' }),
        contactNo: zod_1.z.string({ required_error: 'Contact Number is required!' }),
        gender: zod_1.z.string({ required_error: 'Gender is required!' }),
        bloodGroup: zod_1.z.string({ required_error: 'Blood Group is required!' }),
        designation: zod_1.z.string({ required_error: 'Designation is required!' }),
        academicDepartmentId: zod_1.z.string({
            required_error: 'Academic Department ID is required!',
        }),
        academicFacultyId: zod_1.z.string({
            required_error: 'Academic Faculty ID is required!',
        }),
    }),
});
const updateFacultyZodValidation = zod_1.z.object({
    body: zod_1.z.object({
        facultyId: zod_1.z.string().optional(),
        firstName: zod_1.z.string().optional(),
        lastName: zod_1.z.string().optional(),
        middleName: zod_1.z.string().optional(),
        profileImage: zod_1.z.string().optional(),
        email: zod_1.z.string().optional(),
        contactNo: zod_1.z.string().optional(),
        gender: zod_1.z.string().optional(),
        bloodGroup: zod_1.z.string().optional(),
        designation: zod_1.z.string().optional(),
        academicDepartmentId: zod_1.z.string().optional(),
        academicFacultyId: zod_1.z.string().optional(),
    }),
});
const assignOrRemoveCourses = zod_1.z.object({
    body: zod_1.z.object({
        courses: zod_1.z.array(zod_1.z.string(), { required_error: 'Course Id is required!' }),
    }),
});
exports.FacultyValidation = {
    createFacultyZodValidation,
    updateFacultyZodValidation,
    assignOrRemoveCourses,
};
