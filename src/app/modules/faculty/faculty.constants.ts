export const FacultySearchAbleFields = [
  'firstName',
  'lastName',
  'middleName',
  'email',
  'contactNo',
  'facultyId',
  'designation',
];

export const FacultyFilterAbleFileds = [
  'searchTerm',
  'facultyId',
  'email',
  'contactNo',
  'gender',
  'bloodGroup',
  'designation',
  'academicFacultyId',
  'academicDepartmentId',
];

export const facultyRelationalFields: string[] = [
  'academicFacultyId',
  'academicDepartmentId',
];

export const facultyRelationalFieldsMapper: { [key: string]: string } = {
  academicFacultyId: 'academicFaculty',
  academicDepartmentId: 'academicDepartment',
};
