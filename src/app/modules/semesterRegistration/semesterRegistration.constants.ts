export const SemesterRegistrationFilterAbleFileds = [
  'searchTerm',
  'id',
  'academicSemesterId',
];

export const SemesterRegistrationSearchAbleFields = [];

export const semesterRegistrationRelationalFields: string[] = [
  'academicSemesterId',
];

export const semesterRegistrationRelationalFieldsMapper: {
  [key: string]: string;
} = {
  academicSemesterId: 'academicSemester',
};
