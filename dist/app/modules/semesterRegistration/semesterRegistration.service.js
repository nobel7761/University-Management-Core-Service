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
exports.SemesterRegistrationService = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const client_1 = require("@prisma/client");
const http_status_1 = __importDefault(require("http-status"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const paginationHelper_1 = require("../../../helpers/paginationHelper");
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const semesterRegistration_constants_1 = require("./semesterRegistration.constants");
const createSemesterRegistration = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const isAnySemesterRegistrationUpcomingOrOngoing = yield prisma_1.default.semesterRegistration.findFirst({
        where: {
            OR: [
                {
                    status: client_1.SemesterRegistrationStatus.UPCOMING,
                },
                {
                    status: client_1.SemesterRegistrationStatus.ONGOING,
                },
            ],
        },
    });
    if (isAnySemesterRegistrationUpcomingOrOngoing) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, `There is already an ${isAnySemesterRegistrationUpcomingOrOngoing.status} registration.`);
    }
    const result = yield prisma_1.default.semesterRegistration.create({
        data,
    });
    return result;
});
const getAllSemesterRegistration = (filters, options) => __awaiter(void 0, void 0, void 0, function* () {
    const { limit, page, skip } = paginationHelper_1.paginationHelpers.calculatePagination(options);
    const { searchTerm } = filters, filtersData = __rest(filters, ["searchTerm"]);
    const andConditions = [];
    if (searchTerm) {
        andConditions.push({
            OR: semesterRegistration_constants_1.SemesterRegistrationSearchAbleFields.map(field => ({
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
                if (semesterRegistration_constants_1.semesterRegistrationRelationalFields.includes(key)) {
                    return {
                        [semesterRegistration_constants_1.semesterRegistrationRelationalFieldsMapper[key]]: {
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
    const result = yield prisma_1.default.semesterRegistration.findMany({
        where: whereConditions,
        skip,
        take: limit,
        orderBy: options.sortBy && options.sortOrder
            ? { [options.sortBy]: options.sortOrder }
            : { createdAt: 'desc' },
    });
    const total = yield prisma_1.default.semesterRegistration.count();
    return {
        meta: {
            total,
            page,
            limit,
        },
        data: result,
    };
});
const getSingleSemesterRegistration = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.semesterRegistration.findUnique({
        where: { id },
        include: {
            academicSemester: true,
        },
    });
    if (!result) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "SemesterRegistration Doesn't Exists");
    }
    return result;
});
const updateSingleSemesterRegistration = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isExists = yield prisma_1.default.semesterRegistration.findUnique({
        where: { id },
    });
    if (!isExists) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "SemesterRegistration Doesn't Exists");
    }
    //! we should not able to turn a semester registration from UPCOMING to END. It should be UPCOMING --> ONGOING --> ENDED
    // first we are handling upcoming-->ongoing
    if (payload.status &&
        isExists.status === client_1.SemesterRegistrationStatus.UPCOMING &&
        payload.status !== client_1.SemesterRegistrationStatus.ONGOING) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Can only move from UPCOMING to ONGOING');
    }
    //now we are handling ongoing to ended
    if (payload.status &&
        isExists.status === client_1.SemesterRegistrationStatus.ONGOING &&
        payload.status !== client_1.SemesterRegistrationStatus.ENDED) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Can only move from ONGOING to ENDED');
    }
    const result = yield prisma_1.default.semesterRegistration.update({
        where: { id },
        data: payload,
        include: {
            academicSemester: true,
        },
    });
    return result;
});
const deleteSingleSemesterRegistration = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const isExists = yield prisma_1.default.semesterRegistration.findUnique({
        where: { id },
    });
    if (!isExists) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "SemesterRegistration Doesn't Exists");
    }
    const result = yield prisma_1.default.semesterRegistration.delete({
        where: { id },
        include: {
            academicSemester: true,
        },
    });
    return result;
});
exports.SemesterRegistrationService = {
    createSemesterRegistration,
    getAllSemesterRegistration,
    getSingleSemesterRegistration,
    updateSingleSemesterRegistration,
    deleteSingleSemesterRegistration,
};
