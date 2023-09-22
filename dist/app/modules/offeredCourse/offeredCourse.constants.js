"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.offeredCourseRelationalFieldsMapper = exports.offeredCourseRelationalFields = exports.OfferedCourseSearchAbleFields = exports.OfferedCourseFilterAbleFileds = void 0;
exports.OfferedCourseFilterAbleFileds = [
    'searchTerm',
    'id',
    'status',
    'academicSemesterId',
];
exports.OfferedCourseSearchAbleFields = [];
exports.offeredCourseRelationalFields = [
    'courseId',
    'academicDepartmentId',
    'offeredCourseId',
];
exports.offeredCourseRelationalFieldsMapper = {
    courseId: 'course',
    academicDepartmentId: 'academicDepartment',
    offeredCourseId: 'offeredCourse',
};
