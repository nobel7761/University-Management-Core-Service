/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Course, Prisma } from '@prisma/client';
import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import prisma from '../../../shared/prisma';
import { asyncForEach } from '../../../shared/utils';
import { IPaginationOptions } from './../../../interfaces/pagination';
import { CourseSearchableFields } from './course.constants';
import {
  ICourseCreateData,
  ICourseFilterRequest,
  IPrerequisiteCourseRequest,
} from './course.interfaces';

const createCourse = async (data: ICourseCreateData): Promise<any> => {
  const { preRequisiteCourses, ...courseData } = data;

  const newCourse = await prisma.$transaction(async transaction => {
    const result = await transaction.course.create({
      data: courseData,
    });

    if (!result) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Unable to create course');
    }

    if (preRequisiteCourses && preRequisiteCourses.length > 0) {
      await asyncForEach(
        preRequisiteCourses,
        async (preRequisiteCourse: IPrerequisiteCourseRequest) => {
          const createPrerequisite =
            await transaction.courseToPrerequisite.create({
              data: {
                courseId: result.id,
                preRequisiteId: preRequisiteCourse.courseId,
              },
            });
        }
      );
    }

    return result;
  });

  if (newCourse) {
    const responseData = await prisma.course.findUnique({
      where: {
        id: newCourse.id,
      },
      include: {
        preRequisite: {
          include: {
            preRequisite: true,
          },
        },
        preRequisiteFor: {
          include: {
            course: true,
          },
        },
      },
    });

    return responseData;
  }
};

const getAllCourse = async (
  filters: ICourseFilterRequest,
  options: IPaginationOptions
): Promise<IGenericResponse<Course[]>> => {
  const { limit, page, skip } = paginationHelpers.calculatePagination(options);
  const { searchTerm, ...filtersData } = filters;

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      OR: CourseSearchableFields.map(field => ({
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

  const whereConditions: Prisma.CourseWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.course.findMany({
    where: whereConditions,
    include: {
      preRequisite: {
        include: {
          preRequisite: true,
        },
      },
      preRequisiteFor: {
        include: {
          course: true,
        },
      },
    },
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? { [options.sortBy]: options.sortOrder }
        : { createdAt: 'desc' },
  });

  const total = await prisma.course.count();
  return {
    meta: {
      total,
      page,
      limit,
    },
    data: result,
  };
};

const getSingleCourse = async (id: string): Promise<Course | null> => {
  const result = await prisma.course.findUnique({
    where: { id },
    include: {
      preRequisite: {
        include: {
          preRequisite: true,
        },
      },
      preRequisiteFor: {
        include: {
          course: true,
        },
      },
    },
  });

  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, "Course Doesn't Exists");
  }

  return result;
};

const updateSingleCourse = async (
  id: string,
  data: Partial<ICourseCreateData>
): Promise<Course | null> => {
  const isExists = await prisma.course.findUnique({
    where: { id },
  });

  if (!isExists) {
    throw new ApiError(httpStatus.NOT_FOUND, "Course Doesn't Exists");
  }

  const { preRequisiteCourses, ...courseData } = data;

  await prisma.$transaction(async transaction => {
    const result = await transaction.course.update({
      where: { id },
      data: courseData,
    });

    if (!result) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Unable to update the course!');
    }

    if (preRequisiteCourses && preRequisiteCourses.length > 0) {
      //find out which course should be deleted
      const deletePrerequisite = preRequisiteCourses.filter(
        course => course.courseId && course.isDeleted
      );

      //find out which course should be added
      const newPrerequisite = preRequisiteCourses.filter(
        course => course.courseId && !course.isDeleted
      );

      //delete course
      // for (let index = 0; index < deletePrerequisite.length; index++) {
      //   await transaction.courseToPrerequisite.deleteMany({
      //     where: {
      //       AND: [
      //         {
      //           courseId: id,
      //         },
      //         {
      //           preRequisiteId: deletePrerequisite[index].courseId,
      //         },
      //       ],
      //     },
      //   });
      // }

      //!this will also delete the course! just used a utility function!
      await asyncForEach(
        deletePrerequisite,
        async (deletePrerequisiteCourse: IPrerequisiteCourseRequest) => {
          await transaction.courseToPrerequisite.deleteMany({
            where: {
              AND: [
                {
                  courseId: id,
                },
                {
                  preRequisiteId: deletePrerequisiteCourse.courseId,
                },
              ],
            },
          });
        }
      );

      //create course
      // for (let index = 0; index < newPrerequisite.length; index++) {
      //   await transaction.courseToPrerequisite.create({
      //     data: {
      //       courseId: id,
      //       preRequisiteId: newPrerequisite[index].courseId,
      //     },
      //   });
      // }

      //!this will also create the course! just used a utility function!
      await asyncForEach(
        newPrerequisite,
        async (newPrerequisiteCourse: IPrerequisiteCourseRequest) => {
          await transaction.courseToPrerequisite.create({
            data: {
              courseId: id,
              preRequisiteId: newPrerequisiteCourse.courseId,
            },
          });
        }
      );
    }

    return result;
  });

  const responseData = prisma.course.findUnique({
    where: {
      id,
    },
    include: {
      preRequisite: {
        include: {
          preRequisite: true,
        },
      },
      preRequisiteFor: {
        include: {
          course: true,
        },
      },
    },
  });

  return responseData;
};

const deleteSingleCourse = async (id: string): Promise<Course> => {
  await prisma.courseToPrerequisite.deleteMany({
    where: {
      OR: [
        {
          courseId: id,
        },
        {
          preRequisiteId: id,
        },
      ],
    },
  });

  const result = await prisma.course.delete({
    where: { id },
  });

  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, "Course Doesn't Exists");
  }

  return result;
};

export const CourseService = {
  createCourse,
  getAllCourse,
  getSingleCourse,
  updateSingleCourse,
  deleteSingleCourse,
};
