"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoomValidation = void 0;
const zod_1 = require("zod");
const createRoomZodValidation = zod_1.z.object({
    body: zod_1.z.object({
        roomNumber: zod_1.z.string({ required_error: 'Room Number is required!' }),
        floor: zod_1.z.string({ required_error: 'Floor is required!' }),
        buildingId: zod_1.z.string({ required_error: 'Building ID is required!' }),
    }),
});
const updateRoomZodValidation = zod_1.z.object({
    body: zod_1.z.object({
        roomNumber: zod_1.z.string().optional(),
        floor: zod_1.z.string().optional(),
        buildingId: zod_1.z.string().optional(),
    }),
});
exports.RoomValidation = {
    createRoomZodValidation,
    updateRoomZodValidation,
};
