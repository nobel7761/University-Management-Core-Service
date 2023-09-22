"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.hasTimeConflict = exports.asyncForEach = void 0;
const http_status_1 = __importDefault(require("http-status"));
const ApiError_1 = __importDefault(require("../errors/ApiError"));
const asyncForEach = (array, callback) => __awaiter(void 0, void 0, void 0, function* () {
    if (!Array.isArray(array)) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Expected an array!');
    }
    for (let index = 0; index < array.length; index++) {
        yield callback(array[index], index, array);
    }
});
exports.asyncForEach = asyncForEach;
const hasTimeConflict = (existingSlots, newSlot) => {
    for (const slot of existingSlots) {
        const existingStart = new Date(`1970-01-01T${slot.startTime}:00`);
        const existingEnd = new Date(`1970-01-01T${slot.endTime}:00`);
        const newStart = new Date(`1970-01-01T${newSlot.startTime}:00`);
        const newEnd = new Date(`1970-01-01T${newSlot.endTime}:00`);
        if (newStart < existingEnd && newEnd > existingStart) {
            return true;
        }
    }
    return false;
};
exports.hasTimeConflict = hasTimeConflict;
