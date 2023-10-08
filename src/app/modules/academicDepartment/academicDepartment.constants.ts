export const AcademicDepartmentFilterAbleFileds = [
  'searchTerm',
  'id',
  'academicFacultyId',
];

export const AcademicDepartmentSearchAbleFields = ['title'];

export const academicDepartmentRelationalFields: string[] = [
  'academicFacultyId',
];

export const academicDepartmentRelationalFieldsMapper: {
  [key: string]: string;
} = {
  academicFacultyId: 'academicFaculty',
};
