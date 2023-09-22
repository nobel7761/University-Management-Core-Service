"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OfferedCourseSectionValidation = void 0;
const zod_1 = require("zod");
const createOfferedCourseSectionZodValidation = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string({ required_error: 'Title is Required!' }),
        maxCapacity: zod_1.z.number({ required_error: 'Max Capacity is Required!' }),
        offeredCourseId: zod_1.z.string({
            required_error: 'Offered Course Id is Required!',
        }),
    }),
});
const updateOfferedCourseSectionZodValidation = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string().optional(),
        maxCapacity: zod_1.z.number().optional(),
    }),
});
exports.OfferedCourseSectionValidation = {
    createOfferedCourseSectionZodValidation,
    updateOfferedCourseSectionZodValidation,
};
