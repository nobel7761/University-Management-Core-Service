"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.offeredCourseClassScheduleFilterableFields = exports.offeredCourseClassScheduleRelationalFieldsMapper = exports.offeredCourseClassScheduleRelationalFields = exports.offeredCourseClassScheduleSearchableFields = void 0;
exports.offeredCourseClassScheduleSearchableFields = ['dayOfWeek'];
exports.offeredCourseClassScheduleRelationalFields = [
    'offeredCourseSectionId',
    'semesterRegistrationId',
    'facultyId',
    'roomId',
];
exports.offeredCourseClassScheduleRelationalFieldsMapper = {
    // offeredCourseSectionId String
    // offeredCourseSection OfferedCourseSection @relation(fields: [offeredCourseSectionId], references: [id])
    //! taking the field(offeredCourseSectionId) and ralation_name by which we created the relation with table(offeredCourseSection)
    offeredCourseSectionId: 'offeredCourseSection',
    facultyId: 'faculty',
    roomId: 'room',
    semesterRegistrationId: 'semesterRegistration',
};
exports.offeredCourseClassScheduleFilterableFields = [
    'searchTerm',
    'dayOfWeek',
    'offeredCourseSectionId',
    'semesterRegistrationId',
    'roomId',
    'facultyId',
];
