export const OfferedCourseFilterAbleFileds = [
  'searchTerm',
  'id',
  'status',
  'academicSemesterId',
];

export const OfferedCourseSearchAbleFields = [];

export const offeredCourseRelationalFields: string[] = [
  'courseId',
  'academicDepartmentId',
  'offeredCourseId',
];

export const offeredCourseRelationalFieldsMapper: {
  [key: string]: string;
} = {
  courseId: 'course',
  academicDepartmentId: 'academicDepartment',
  offeredCourseId: 'offeredCourse',
};
