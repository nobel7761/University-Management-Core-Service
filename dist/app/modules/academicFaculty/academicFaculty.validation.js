"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AcademicFacultyValidation = void 0;
const zod_1 = require("zod");
const createAcademicFacultyZodValidation = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string({ required_error: 'Title is required!' }),
    }),
});
const updateAcademicFacultyZodValidation = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string().optional(),
    }),
});
exports.AcademicFacultyValidation = {
    createAcademicFacultyZodValidation,
    updateAcademicFacultyZodValidation,
};
