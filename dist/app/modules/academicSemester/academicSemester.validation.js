"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AcademicSemesterValidation = void 0;
const zod_1 = require("zod");
const createAcademicSemesterZodValidation = zod_1.z.object({
    body: zod_1.z.object({
        year: zod_1.z.number({ required_error: 'Year is required!' }),
        title: zod_1.z.string({ required_error: 'Title is required!' }),
        code: zod_1.z.string({ required_error: 'Code is required!' }),
        startMonth: zod_1.z.string({ required_error: 'Start Month is required!' }),
        endMonth: zod_1.z.string({ required_error: 'End Month is required!' }),
    }),
});
const updateAcademicSemesterZodValidation = zod_1.z.object({
    body: zod_1.z.object({
        year: zod_1.z.number().optional(),
        title: zod_1.z.string().optional(),
        code: zod_1.z.string().optional(),
        startMonth: zod_1.z.string().optional(),
        endMonth: zod_1.z.string().optional(),
    }),
});
exports.AcademicSemesterValidation = {
    createAcademicSemesterZodValidation,
    updateAcademicSemesterZodValidation,
};
