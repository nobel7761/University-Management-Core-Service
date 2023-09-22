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
exports.AcademicDepartmentService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const paginationHelper_1 = require("../../../helpers/paginationHelper");
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const academicDepartment_constants_1 = require("./academicDepartment.constants");
const createAcademicDepartment = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.academicDepartment.create({
        data,
        include: {
            academicFaculty: true,
        },
    });
    return result;
});
const getAllAcademicDepartment = (filters, options) => __awaiter(void 0, void 0, void 0, function* () {
    const { limit, page, skip } = paginationHelper_1.paginationHelpers.calculatePagination(options);
    const { searchTerm } = filters, filtersData = __rest(filters, ["searchTerm"]);
    const andConditions = [];
    if (searchTerm) {
        andConditions.push({
            OR: academicDepartment_constants_1.AcademicDepartmentSearchAbleFields.map(field => ({
                [field]: {
                    contains: searchTerm,
                    mode: 'insensitive',
                },
            })),
        });
    }
    if (Object.keys(filtersData).length > 0) {
        andConditions.push({
            AND: Object.keys(filtersData).map(key => ({
                [key]: {
                    equals: filtersData[key],
                },
            })),
        });
    }
    const whereConditions = andConditions.length > 0 ? { AND: andConditions } : {};
    const result = yield prisma_1.default.academicDepartment.findMany({
        where: whereConditions,
        include: {
            academicFaculty: true,
        },
        skip,
        take: limit,
        orderBy: options.sortBy && options.sortOrder
            ? { [options.sortBy]: options.sortOrder }
            : { createdAt: 'desc' },
    });
    const total = yield prisma_1.default.academicDepartment.count();
    return {
        meta: {
            total,
            page,
            limit,
        },
        data: result,
    };
});
const getSingleAcademicDepartment = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.academicDepartment.findUnique({
        where: { id },
        include: {
            academicFaculty: true,
        },
    });
    if (!result) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Academic Department Doesn't Exists");
    }
    return result;
});
const updateSingleAcademicDepartment = (data, id) => __awaiter(void 0, void 0, void 0, function* () {
    const isExists = yield prisma_1.default.academicDepartment.findUnique({
        where: { id },
        include: {
            academicFaculty: true,
        },
    });
    if (!isExists) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Academic Department Doesn't Exists");
    }
    const result = yield prisma_1.default.academicDepartment.update({
        where: { id },
        data,
        include: {
            academicFaculty: true,
        },
    });
    return result;
});
const deleteSingleAcademicDepartment = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.academicDepartment.delete({
        where: { id },
        include: {
            academicFaculty: true,
        },
    });
    if (!result) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Academic Department Doesn't Exists");
    }
    return result;
});
exports.AcademicDepartmentService = {
    createAcademicDepartment,
    getAllAcademicDepartment,
    getSingleAcademicDepartment,
    updateSingleAcademicDepartment,
    deleteSingleAcademicDepartment,
};
