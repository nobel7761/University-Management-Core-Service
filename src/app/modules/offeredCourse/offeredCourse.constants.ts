export const OfferedCourseFilterAbleFileds = [
  'searchTerm',
  'id',
  'semesterRegistrationId',
  'courseId',
  'academicDepartmentId',
];

export const OfferedCourseSearchAbleFields = [];

export const offeredCourseRelationalFields: string[] = [
  'semesterRegistrationId',
  'courseId',
  'academicDepartmentId',
];

export const offeredCourseRelationalFieldsMapper: {
  [key: string]: string;
} = {
  semesterRegistrationId: 'semesterRegistration',
  courseId: 'course',
  academicDepartmentId: 'academicDepartment',
};
