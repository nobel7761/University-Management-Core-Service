"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CourseValidation = void 0;
const zod_1 = require("zod");
const createCourseZodValidation = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string({ required_error: 'Title is required!' }),
        code: zod_1.z.string({ required_error: 'Course Code is required!' }),
        credit: zod_1.z.number({ required_error: 'Course Credit is required!' }),
    }),
});
const updateCourseZodValidation = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string().optional(),
        code: zod_1.z.string().optional(),
        credit: zod_1.z.number().optional(),
    }),
});
const assignOrRemoveFaculties = zod_1.z.object({
    body: zod_1.z.object({
        faculties: zod_1.z.array(zod_1.z.string({ required_error: 'Faculty Id is required!' })),
    }),
});
exports.CourseValidation = {
    createCourseZodValidation,
    updateCourseZodValidation,
    assignOrRemoveFaculties,
};
