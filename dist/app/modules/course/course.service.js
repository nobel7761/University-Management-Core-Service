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
exports.CourseService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const paginationHelper_1 = require("../../../helpers/paginationHelper");
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const utils_1 = require("../../../shared/utils");
const course_constants_1 = require("./course.constants");
const createCourse = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const { preRequisiteCourses } = data, courseData = __rest(data, ["preRequisiteCourses"]);
    const newCourse = yield prisma_1.default.$transaction((transaction) => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield transaction.course.create({
            data: courseData,
        });
        if (!result) {
            throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Unable to create course');
        }
        if (preRequisiteCourses && preRequisiteCourses.length > 0) {
            yield (0, utils_1.asyncForEach)(preRequisiteCourses, (preRequisiteCourse) => __awaiter(void 0, void 0, void 0, function* () {
                const createPrerequisite = yield transaction.courseToPrerequisite.create({
                    data: {
                        courseId: result.id,
                        preRequisiteId: preRequisiteCourse.courseId,
                    },
                });
            }));
        }
        return result;
    }));
    if (newCourse) {
        const responseData = yield prisma_1.default.course.findUnique({
            where: {
                id: newCourse.id,
            },
            include: {
                preRequisite: {
                    include: {
                        preRequisite: true,
                    },
                },
                preRequisiteFor: {
                    include: {
                        course: true,
                    },
                },
            },
        });
        return responseData;
    }
});
const getAllCourse = (filters, options) => __awaiter(void 0, void 0, void 0, function* () {
    const { limit, page, skip } = paginationHelper_1.paginationHelpers.calculatePagination(options);
    const { searchTerm } = filters, filtersData = __rest(filters, ["searchTerm"]);
    const andConditions = [];
    if (searchTerm) {
        andConditions.push({
            OR: course_constants_1.CourseSearchableFields.map(field => ({
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
    const result = yield prisma_1.default.course.findMany({
        where: whereConditions,
        include: {
            preRequisite: {
                include: {
                    preRequisite: true,
                },
            },
            preRequisiteFor: {
                include: {
                    course: true,
                },
            },
        },
        skip,
        take: limit,
        orderBy: options.sortBy && options.sortOrder
            ? { [options.sortBy]: options.sortOrder }
            : { createdAt: 'desc' },
    });
    const total = yield prisma_1.default.course.count();
    return {
        meta: {
            total,
            page,
            limit,
        },
        data: result,
    };
});
const getSingleCourse = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.course.findUnique({
        where: { id },
        include: {
            preRequisite: {
                include: {
                    preRequisite: true,
                },
            },
            preRequisiteFor: {
                include: {
                    course: true,
                },
            },
        },
    });
    if (!result) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Course Doesn't Exists");
    }
    return result;
});
const updateSingleCourse = (id, data) => __awaiter(void 0, void 0, void 0, function* () {
    const isExists = yield prisma_1.default.course.findUnique({
        where: { id },
    });
    if (!isExists) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Course Doesn't Exists");
    }
    const { preRequisiteCourses } = data, courseData = __rest(data, ["preRequisiteCourses"]);
    yield prisma_1.default.$transaction((transaction) => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield transaction.course.update({
            where: { id },
            data: courseData,
        });
        if (!result) {
            throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Unable to update the course!');
        }
        if (preRequisiteCourses && preRequisiteCourses.length > 0) {
            //find out which course should be deleted
            const deletePrerequisite = preRequisiteCourses.filter(course => course.courseId && course.isDeleted);
            //find out which course should be added
            const newPrerequisite = preRequisiteCourses.filter(course => course.courseId && !course.isDeleted);
            //delete course
            // for (let index = 0; index < deletePrerequisite.length; index++) {
            //   await transaction.courseToPrerequisite.deleteMany({
            //     where: {
            //       AND: [
            //         {
            //           courseId: id,
            //         },
            //         {
            //           preRequisiteId: deletePrerequisite[index].courseId,
            //         },
            //       ],
            //     },
            //   });
            // }
            //!this will also delete the course! just used a utility function!
            yield (0, utils_1.asyncForEach)(deletePrerequisite, (deletePrerequisiteCourse) => __awaiter(void 0, void 0, void 0, function* () {
                yield transaction.courseToPrerequisite.deleteMany({
                    where: {
                        AND: [
                            {
                                courseId: id,
                            },
                            {
                                preRequisiteId: deletePrerequisiteCourse.courseId,
                            },
                        ],
                    },
                });
            }));
            //create course
            // for (let index = 0; index < newPrerequisite.length; index++) {
            //   await transaction.courseToPrerequisite.create({
            //     data: {
            //       courseId: id,
            //       preRequisiteId: newPrerequisite[index].courseId,
            //     },
            //   });
            // }
            //!this will also create the course! just used a utility function!
            yield (0, utils_1.asyncForEach)(newPrerequisite, (newPrerequisiteCourse) => __awaiter(void 0, void 0, void 0, function* () {
                yield transaction.courseToPrerequisite.create({
                    data: {
                        courseId: id,
                        preRequisiteId: newPrerequisiteCourse.courseId,
                    },
                });
            }));
        }
        return result;
    }));
    const responseData = prisma_1.default.course.findUnique({
        where: {
            id,
        },
        include: {
            preRequisite: {
                include: {
                    preRequisite: true,
                },
            },
            preRequisiteFor: {
                include: {
                    course: true,
                },
            },
        },
    });
    return responseData;
});
const deleteSingleCourse = (id) => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma_1.default.courseToPrerequisite.deleteMany({
        where: {
            OR: [
                {
                    courseId: id,
                },
                {
                    preRequisiteId: id,
                },
            ],
        },
    });
    const result = yield prisma_1.default.course.delete({
        where: { id },
    });
    if (!result) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Course Doesn't Exists");
    }
    return result;
});
const assignCourseFaculty = (id, data) => __awaiter(void 0, void 0, void 0, function* () {
    //here we will get a array of string. that is why we are mapping them and taking one faculty id(idOfFaculty) each time.
    //then we are combining a object like this: {courseId: id, facultyId: idOfFaculty}
    yield prisma_1.default.courseFaculty.createMany({
        data: data.map(idOfFaculty => ({
            courseId: id,
            facultyId: idOfFaculty,
        })),
    });
    const result = yield prisma_1.default.courseFaculty.findMany({
        where: {
            courseId: id,
        },
        include: {
            course: true,
            faculty: {
                include: {
                    academicDepartment: true,
                    academicFaculty: true,
                },
            },
        },
    });
    return result;
});
const removeCourseFaculty = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.courseFaculty.deleteMany({
        where: {
            courseId: id,
            facultyId: {
                in: payload,
            },
        },
    });
    return result;
});
const getSingleCourseWithFaculty = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.courseFaculty.findMany({
        where: {
            courseId: id,
        },
        include: {
            course: true,
            faculty: true,
        },
    });
    return result;
});
const getAllCourseWithFaculty = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.courseFaculty.findMany({
        include: {
            course: true,
            faculty: true,
        },
    });
    return result;
});
exports.CourseService = {
    createCourse,
    getAllCourse,
    getSingleCourse,
    updateSingleCourse,
    deleteSingleCourse,
    assignCourseFaculty,
    removeCourseFaculty,
    getSingleCourseWithFaculty,
    getAllCourseWithFaculty,
};
