/* eslint-disable @typescript-eslint/no-explicit-any */
import { CourseFaculty, Faculty, Prisma } from '@prisma/client';
import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import prisma from '../../../shared/prisma';
import { IPaginationOptions } from './../../../interfaces/pagination';
import { FacultySearchAbleFields } from './faculty.constants';
import { IFacultyFilterRequest } from './faculty.interfaces';

const createFaculty = async (data: Faculty): Promise<Faculty> => {
  const result = await prisma.faculty.create({
    data,
    include: {
      academicDepartment: true,
      academicFaculty: true,
    },
  });

  return result;
};

const getAllFaculty = async (
  filters: IFacultyFilterRequest,
  options: IPaginationOptions
): Promise<IGenericResponse<Faculty[]>> => {
  const { limit, page, skip } = paginationHelpers.calculatePagination(options);
  const { searchTerm, ...filtersData } = filters;

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      OR: FacultySearchAbleFields.map(field => ({
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

  const whereConditions: Prisma.FacultyWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.faculty.findMany({
    where: whereConditions,
    skip,
    include: {
      academicDepartment: true,
      academicFaculty: true,
    },
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? { [options.sortBy]: options.sortOrder }
        : { createdAt: 'desc' },
  });

  const total = await prisma.faculty.count();
  return {
    meta: {
      total,
      page,
      limit,
    },
    data: result,
  };
};

const getSingleFaculty = async (id: string): Promise<Faculty | null> => {
  const result = await prisma.faculty.findUnique({
    where: { id },
    include: {
      academicDepartment: true,
      academicFaculty: true,
    },
  });

  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, "Faculty Doesn't Exists");
  }

  return result;
};

const updateSingleFaculty = async (
  data: Partial<Faculty>,
  id: string
): Promise<Faculty | null> => {
  const isExists = await prisma.faculty.findUnique({
    where: { id },
  });

  if (!isExists) {
    throw new ApiError(httpStatus.NOT_FOUND, "Faculty Doesn't Exists");
  }

  const result = await prisma.faculty.update({
    where: { id },
    data,
    include: {
      academicDepartment: true,
      academicFaculty: true,
    },
  });

  return result;
};

const deleteSingleFaculty = async (id: string): Promise<Faculty> => {
  const result = await prisma.faculty.delete({
    where: { id },
    include: {
      academicDepartment: true,
      academicFaculty: true,
    },
  });

  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, "Faculty Doesn't Exists");
  }

  return result;
};

const assignCoursesToFaculty = async (
  id: string,
  payload: string[]
): Promise<CourseFaculty[]> => {
  console.log(payload);
  //here we will get a array of string. that is why we are mapping them and taking one faculty id(idOfFaculty) each time.
  //then we are combining a object like this: {courseId: id, facultyId: idOfFaculty}
  await prisma.courseFaculty.createMany({
    data: payload.map(idOfCourses => ({
      facultyId: id,
      courseId: idOfCourses,
    })),
  });

  const result = await prisma.courseFaculty.findMany({
    where: {
      facultyId: id,
    },
    include: {
      course: true,
    },
  });

  return result;
};

const removeCoursesFromFaculty = async (id: string, payload: string[]) => {
  const result = await prisma.courseFaculty.deleteMany({
    where: {
      facultyId: id,
      courseId: {
        in: payload,
      },
    },
  });

  return result;
};

const myCourses = async (
  authUser: { userId: string; role: string },
  filter: {
    academicSemesterId?: string | null | undefined;
    courseId?: string | null | undefined;
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

  const offeredCourseSections = await prisma.offeredCourseSection.findMany({
    where: {
      offeredCourseClassSchedules: {
        //here, offeredCourseClassSchedules is an array. but i want to see my course as a course faculty. However, my course will not be present in every schedules. I'm assigned in some courses and not assigned in other courses. so for that, we can use some
        some: {
          faculty: {
            facultyId: authUser.userId,
          },
        },
      },
      offeredCourse: {
        semesterRegistration: {
          academicSemester: {
            id: filter.academicSemesterId,
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
      offeredCourseClassSchedules: {
        include: {
          room: {
            include: {
              building: true,
            },
          },
        },
      },
    },
  });

  const courseAndSchedule = offeredCourseSections.reduce(
    (acc: any, obj: any) => {
      const course = obj.offeredCourse.course;
      const classSchedules = obj.offeredCourseClassSchedules;

      const existingCourse = acc.find(
        (item: any) => item.course?.id === course?.id
      );

      if (existingCourse) {
        existingCourse.sections.push({
          section: obj,
          classSchedules,
        });
      } else {
        acc.push({
          course,
          sections: {
            section: obj,
            classSchedules,
          },
        });
      }

      return acc;
    },
    []
  );

  return courseAndSchedule;
};

export const FacultyService = {
  createFaculty,
  getAllFaculty,
  getSingleFaculty,
  updateSingleFaculty,
  deleteSingleFaculty,
  assignCoursesToFaculty,
  removeCoursesFromFaculty,
  myCourses,
};
