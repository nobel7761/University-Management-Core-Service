/* eslint-disable @typescript-eslint/no-explicit-any */
import { Prisma, Student, StudentEnrolledCourseStatus } from '@prisma/client';
import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import prisma from '../../../shared/prisma';
import { IPaginationOptions } from './../../../interfaces/pagination';
import { StudentSearchableFields } from './student.constants';
import { IStudentFilterRequest } from './student.interfaces';
import { StudentUtils } from './student.utils';

const createStudent = async (data: Student): Promise<Student> => {
  const result = await prisma.student.create({
    data,
    include: {
      academicDepartment: true,
      academicFaculty: true,
      academicSemester: true,
    },
  });

  return result;
};

const getAllStudent = async (
  filters: IStudentFilterRequest,
  options: IPaginationOptions
): Promise<IGenericResponse<Student[]>> => {
  const { limit, page, skip } = paginationHelpers.calculatePagination(options);
  const { searchTerm, ...filtersData } = filters;

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      OR: StudentSearchableFields.map(field => ({
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
          equals: (filtersData as any)[key],
        },
      })),
    });
  }

  const whereConditions: Prisma.StudentWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.student.findMany({
    where: whereConditions,
    skip,
    include: {
      academicDepartment: true,
      academicFaculty: true,
      academicSemester: true,
    },
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? { [options.sortBy]: options.sortOrder }
        : { createdAt: 'desc' },
  });

  const total = await prisma.student.count();
  return {
    meta: {
      total,
      page,
      limit,
    },
    data: result,
  };
};

const getSingleStudent = async (id: string): Promise<Student | null> => {
  const result = await prisma.student.findUnique({
    where: { id },
    include: {
      academicDepartment: true,
      academicFaculty: true,
      academicSemester: true,
    },
  });

  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, "Student Doesn't Exists");
  }

  return result;
};

const updateSingleStudent = async (
  data: Partial<Student>,
  id: string
): Promise<Student | null> => {
  const isExists = await prisma.student.findUnique({
    where: { id },
  });

  if (!isExists) {
    throw new ApiError(httpStatus.NOT_FOUND, "Student Doesn't Exists");
  }

  const result = await prisma.student.update({
    where: { id },
    data,
    include: {
      academicDepartment: true,
      academicFaculty: true,
      academicSemester: true,
    },
  });

  return result;
};

const deleteSingleStudent = async (id: string): Promise<Student> => {
  const result = await prisma.student.delete({
    where: { id },
    include: {
      academicDepartment: true,
      academicFaculty: true,
      academicSemester: true,
    },
  });

  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, "Student Doesn't Exists");
  }

  return result;
};

const myCourses = async (
  authUserId: string,
  filter: {
    courseId?: string | undefined;
    academicSemesterId?: string | undefined;
  }
) => {
  if (!filter.academicSemesterId) {
    const currentSemester = await prisma.academicSemester.findFirst({
      where: {
        isCurrent: true,
      },
    });

    filter.academicSemesterId = currentSemester?.id;
  }

  const result = await prisma.studentEnrolledCourse.findMany({
    where: {
      student: {
        studentId: authUserId,
      },
      ...filter,
    },
    include: {
      course: true,
    },
  });

  return result;
};

const getMyCourseSchedules = async (
  authUserId: string,
  filter: {
    courseId?: string | undefined;
    academicSemesterId?: string | undefined;
  }
) => {
  if (!filter.academicSemesterId) {
    const currentSemester = await prisma.academicSemester.findFirst({
      where: {
        isCurrent: true,
      },
    });

    filter.academicSemesterId = currentSemester?.id;
  }

  const studentEnrolledCourses = myCourses(authUserId, filter);

  const studentEnrolledCoursesIds = (await studentEnrolledCourses).map(
    item => item.courseId
  );

  const result = await prisma.studentSemesterRegistrationCourse.findMany({
    where: {
      student: {
        studentId: authUserId,
      },
      semesterRegistration: {
        academicSemester: {
          id: filter.academicSemesterId,
        },
      },
      offeredCourse: {
        course: {
          id: {
            in: studentEnrolledCoursesIds,
          },
        },
      },
    },
    include: {
      offeredCourse: {
        include: {
          course: true,
        },
      },
      offeredCourseSection: {
        include: {
          offeredCourseClassSchedules: {
            include: {
              room: {
                include: {
                  building: true,
                },
              },
              faculty: true,
            },
          },
        },
      },
    },
  });

  return result;
};

const getMyAcademicInfo = async (authUserId: string): Promise<any> => {
  const academicInfo = await prisma.studentAcademicInfo.findFirst({
    where: {
      student: {
        studentId: authUserId,
      },
    },
  });

  const enrolledCourses = await prisma.studentEnrolledCourse.findMany({
    where: {
      student: {
        studentId: authUserId,
      },
      status: StudentEnrolledCourseStatus.COMPLETED,
    },
    include: {
      course: true,
      academicSemester: true,
    },
    orderBy: {
      createdAt: 'asc',
    },
  });

  const groupByAcademicSemesterData =
    StudentUtils.groupByAcademicSemester(enrolledCourses);

  return {
    academicInfo,
    courses: groupByAcademicSemesterData,
  };
};

export const StudentService = {
  createStudent,
  getAllStudent,
  getSingleStudent,
  updateSingleStudent,
  deleteSingleStudent,
  myCourses,
  getMyCourseSchedules,
  getMyAcademicInfo,
};
