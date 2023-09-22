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
exports.OfferedCourseService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const paginationHelper_1 = require("../../../helpers/paginationHelper");
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const utils_1 = require("../../../shared/utils");
const offeredCourse_constants_1 = require("./offeredCourse.constants");
const createOfferedCourse = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const { academicDepartmentId, semesterRegistrationId, courseIds } = data;
    const result = [];
    (0, utils_1.asyncForEach)(courseIds, (courseId) => __awaiter(void 0, void 0, void 0, function* () {
        const isExist = yield prisma_1.default.offeredCourse.findFirst({
            where: {
                academicDepartmentId,
                semesterRegistrationId,
                courseId,
            },
        });
        if (isExist)
            throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Offered Course is Already Exists');
        if (!isExist) {
            const insertedOfferedCourse = yield prisma_1.default.offeredCourse.create({
                data: {
                    academicDepartmentId,
                    semesterRegistrationId,
                    courseId,
                },
                include: {
                    academicDepartment: true,
                    semesterRegistration: true,
                    course: true,
                },
            });
            result.push(insertedOfferedCourse);
        }
    }));
    return result;
});
const getAllOfferedCourse = (filters, options) => __awaiter(void 0, void 0, void 0, function* () {
    const { limit, page, skip } = paginationHelper_1.paginationHelpers.calculatePagination(options);
    const { searchTerm } = filters, filtersData = __rest(filters, ["searchTerm"]);
    const andConditions = [];
    if (searchTerm) {
        andConditions.push({
            OR: offeredCourse_constants_1.OfferedCourseSearchAbleFields.map(field => ({
                [field]: {
                    contains: searchTerm,
                    mode: 'insensitive',
                },
            })),
        });
    }
    if (Object.keys(filtersData).length > 0) {
        andConditions.push({
            AND: Object.keys(filtersData).map(key => {
                if (offeredCourse_constants_1.offeredCourseRelationalFields.includes(key)) {
                    return {
                        [offeredCourse_constants_1.offeredCourseRelationalFieldsMapper[key]]: {
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
    const result = yield prisma_1.default.offeredCourse.findMany({
        where: whereConditions,
        skip,
        take: limit,
        orderBy: options.sortBy && options.sortOrder
            ? { [options.sortBy]: options.sortOrder }
            : { createdAt: 'desc' },
    });
    const total = yield prisma_1.default.offeredCourse.count();
    return {
        meta: {
            total,
            page,
            limit,
        },
        data: result,
    };
});
const getSingleOfferedCourse = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.offeredCourse.findUnique({
        where: { id },
        include: {
            academicDepartment: true,
            semesterRegistration: true,
            course: true,
        },
    });
    if (!result) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "OfferedCourse Doesn't Exists");
    }
    return result;
});
const updateSingleOfferedCourse = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isExists = yield prisma_1.default.offeredCourse.findUnique({
        where: { id },
    });
    if (!isExists) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "OfferedCourse Doesn't Exists");
    }
    const result = yield prisma_1.default.offeredCourse.update({
        where: { id },
        data: payload,
        include: {
            academicDepartment: true,
            semesterRegistration: true,
            course: true,
        },
    });
    return result;
});
const deleteSingleOfferedCourse = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const isExists = yield prisma_1.default.offeredCourse.findUnique({
        where: { id },
    });
    if (!isExists) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "OfferedCourse Doesn't Exists");
    }
    const result = yield prisma_1.default.offeredCourse.delete({
        where: { id },
        include: {
            academicDepartment: true,
            semesterRegistration: true,
            course: true,
        },
    });
    return result;
});
exports.OfferedCourseService = {
    createOfferedCourse,
    getAllOfferedCourse,
    getSingleOfferedCourse,
    updateSingleOfferedCourse,
    deleteSingleOfferedCourse,
};
