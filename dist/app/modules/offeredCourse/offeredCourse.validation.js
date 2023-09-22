"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OfferedCourseValidation = void 0;
const zod_1 = require("zod");
const createOfferedCourseZodValidation = zod_1.z.object({
    body: zod_1.z.object({
        courseId: zod_1.z.array(zod_1.z.string({
            required_error: 'Course Id is Required!',
        }), { required_error: 'Course Ids are Required!' }),
        academicDepartmentId: zod_1.z.string({
            required_error: 'Academic Department Id is Required!',
        }),
        semesterRegistrationId: zod_1.z.string({
            required_error: 'Semester Registration Id is Required!',
        }),
    }),
});
const updateOfferedCourseZodValidation = zod_1.z.object({
    body: zod_1.z.object({
        courseId: zod_1.z.array(zod_1.z.string()).optional(),
        academicDepartmentId: zod_1.z.string().optional(),
        semesterRegistrationId: zod_1.z.string().optional(),
    }),
});
exports.OfferedCourseValidation = {
    createOfferedCourseZodValidation,
    updateOfferedCourseZodValidation,
};
