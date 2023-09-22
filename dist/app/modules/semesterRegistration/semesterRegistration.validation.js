"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SemesterRegistrationValidation = void 0;
const client_1 = require("@prisma/client");
const zod_1 = require("zod");
const createSemesterRegistrationZodValidation = zod_1.z.object({
    body: zod_1.z.object({
        startDate: zod_1.z.string({ required_error: 'Start Date is Required' }),
        endDate: zod_1.z.string({ required_error: 'End Date is Required' }),
        minCredit: zod_1.z.number({ required_error: 'Minimum Credit is Required' }),
        maxCredit: zod_1.z.number({ required_error: 'Maximum Credit is Required' }),
        academicSemesterId: zod_1.z.string({
            required_error: 'Academic Semester Id is Required!',
        }),
    }),
});
const updateSemesterRegistrationZodValidation = zod_1.z.object({
    body: zod_1.z.object({
        startDate: zod_1.z.string().optional(),
        endDate: zod_1.z.string().optional(),
        status: zod_1.z
            .enum([...Object.values(client_1.SemesterRegistrationStatus)], {})
            .optional(),
        minCredit: zod_1.z.number().optional(),
        maxCredit: zod_1.z.number().optional(),
        academicSemesterId: zod_1.z.string().optional(),
    }),
});
exports.SemesterRegistrationValidation = {
    createSemesterRegistrationZodValidation,
    updateSemesterRegistrationZodValidation,
};
