"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BuildingValidation = void 0;
const zod_1 = require("zod");
const createBuildingZodValidation = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string({ required_error: 'Title is required!' }),
    }),
});
const updateBuildingZodValidation = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string({ required_error: 'Title is required!' }),
    }),
});
exports.BuildingValidation = {
    createBuildingZodValidation,
    updateBuildingZodValidation,
};
