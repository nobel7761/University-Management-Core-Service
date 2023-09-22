export const offeredCourseClassScheduleSearchableFields = ['dayOfWeek'];

export const offeredCourseClassScheduleRelationalFields = [
  'offeredCourseSectionId',
  'semesterRegistrationId',
  'facultyId',
  'roomId',
];

export const offeredCourseClassScheduleRelationalFieldsMapper: {
  [key: string]: string;
} = {
  // offeredCourseSectionId String
  // offeredCourseSection OfferedCourseSection @relation(fields: [offeredCourseSectionId], references: [id])

  //! taking the field(offeredCourseSectionId) and ralation_name by which we created the relation with table(offeredCourseSection)
  offeredCourseSectionId: 'offeredCourseSection',
  facultyId: 'faculty',
  roomId: 'room',
  semesterRegistrationId: 'semesterRegistration',
};

export const offeredCourseClassScheduleFilterableFields = [
  'searchTerm',
  'dayOfWeek',
  'offeredCourseSectionId',
  'semesterRegistrationId',
  'roomId',
  'facultyId',
];
