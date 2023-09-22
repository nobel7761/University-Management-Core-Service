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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OfferedCourseClassScheduleService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const paginationHelper_1 = require("../../../helpers/paginationHelper");
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const offeredCourseClassSchedule_constants_1 = require("./offeredCourseClassSchedule.constants");
const offeredCourseClassSchedule_utils_1 = require("./offeredCourseClassSchedule.utils");
const createOfferedCourseClassSchedule = (data) => __awaiter(void 0, void 0, void 0, function* () {
    yield offeredCourseClassSchedule_utils_1.OfferedCourseClassScheduleUtils.checkRoomAvailable(data);
    yield offeredCourseClassSchedule_utils_1.OfferedCourseClassScheduleUtils.checkFacultyAvailable(data);
    const result = yield prisma_1.default.offeredCourseClassSchedule.create({
        data,
    });
    return result;
});
const getAllOfferedCourseClassSchedule = (filters, options) => __awaiter(void 0, void 0, void 0, function* () {
    const { limit, page, skip } = paginationHelper_1.paginationHelpers.calculatePagination(options);
    const { searchTerm } = filters, filtersData = __rest(filters, ["searchTerm"]);
    const andConditions = [];
    if (searchTerm) {
        andConditions.push({
            OR: offeredCourseClassSchedule_constants_1.offeredCourseClassScheduleSearchableFields.map(field => ({
                [field]: {
                    contains: searchTerm,
                    mode: 'insensitive',
                },
            })),
        });
    }
    //! as we have to filter out data from another field that is why we have to add the relational field here!
    // we will only add table name(e.x: room) with the field(e.x: roomId) by which relation is creating!
    if (Object.keys(filtersData).length > 0) {
        andConditions.push({
            AND: Object.keys(filtersData).map(key => {
                // here we have to declare the fields
                if (offeredCourseClassSchedule_constants_1.offeredCourseClassScheduleRelationalFields.includes(key)) {
                    return {
                        // here we have to declare the table with fields where we will filter
                        [offeredCourseClassSchedule_constants_1.offeredCourseClassScheduleRelationalFieldsMapper[key]]: {
                            id: filtersData[key],
                        },
                    };
                }
                else {
                    return {
                        [key]: {
                            equals: filtersData[key],
                        },
                    };
                }
            }),
        });
    }
    const whereConditions = andConditions.length > 0 ? { AND: andConditions } : {};
    const result = yield prisma_1.default.offeredCourseClassSchedule.findMany({
        where: whereConditions,
        include: {
            faculty: true,
            semesterRegistration: true,
            room: true,
            offeredCourseSection: true,
        },
        skip,
        take: limit,
        orderBy: options.sortBy && options.sortOrder
            ? { [options.sortBy]: options.sortOrder }
            : { createdAt: 'desc' },
    });
    const total = yield prisma_1.default.offeredCourseClassSchedule.count();
    return {
        meta: {
            total,
            page,
            limit,
        },
        data: result,
    };
});
const getSingleOfferedCourseClassSchedule = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.offeredCourseClassSchedule.findUnique({
        where: { id },
        include: {
            offeredCourseSection: true,
            faculty: true,
            room: true,
        },
    });
    if (!result) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "OfferedCourseClassSchedule Doesn't Exists");
    }
    return result;
});
const updateSingleOfferedCourseClassSchedule = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isExists = yield prisma_1.default.offeredCourseClassSchedule.findUnique({
        where: { id },
    });
    if (!isExists) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "OfferedCourseClassSchedule Doesn't Exists");
    }
    const result = yield prisma_1.default.offeredCourseClassSchedule.update({
        where: { id },
        data: payload,
        include: {
            offeredCourseSection: true,
            faculty: true,
            room: true,
        },
    });
    return result;
});
const deleteSingleOfferedCourseClassSchedule = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const isExists = yield prisma_1.default.offeredCourseClassSchedule.findUnique({
        where: { id },
    });
    if (!isExists) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "OfferedCourseClassSchedule Doesn't Exists");
    }
    const result = yield prisma_1.default.offeredCourseClassSchedule.delete({
        where: { id },
        include: {
            offeredCourseSection: true,
            faculty: true,
            room: true,
        },
    });
    return result;
});
exports.OfferedCourseClassScheduleService = {
    createOfferedCourseClassSchedule,
    getAllOfferedCourseClassSchedule,
    getSingleOfferedCourseClassSchedule,
    updateSingleOfferedCourseClassSchedule,
    deleteSingleOfferedCourseClassSchedule,
};
