export const academicSemesterTitleCodeMapper: {
  [key: string]: string;
} = {
  Autumn: '01',
  Summer: '02',
  Fall: '03',
};

export const AcademicSemesterSearchAbleFields = [
  'title',
  'code',
  'startMonth',
  'endMonth',
];

export const AcademicSemesterFilterAbleFileds = [
  'searchTerm',
  'year',
  'code',
  'startMonth',
  'endMonth',
];
