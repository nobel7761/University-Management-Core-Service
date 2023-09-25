/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Prisma,
  SemesterRegistration,
  SemesterRegistrationStatus,
  StudentSemesterRegistration,
} from '@prisma/client';
import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import prisma from '../../../shared/prisma';
import {
  SemesterRegistrationSearchAbleFields,
  semesterRegistrationRelationalFields,
  semesterRegistrationRelationalFieldsMapper,
} from './semesterRegistration.constants';
import {
  IEnrollCoursePayload,
  ISemesterRegistrationFilterRequest,
} from './semesterRegistration.interfaces';

const createSemesterRegistration = async (
  data: SemesterRegistration
): Promise<SemesterRegistration> => {
  const isAnySemesterRegistrationUpcomingOrOngoing =
    await prisma.semesterRegistration.findFirst({
      where: {
        OR: [
          {
            status: SemesterRegistrationStatus.UPCOMING,
          },
          {
            status: SemesterRegistrationStatus.ONGOING,
          },
        ],
      },
    });

  if (isAnySemesterRegistrationUpcomingOrOngoing) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      `There is already an ${isAnySemesterRegistrationUpcomingOrOngoing.status} registration.`
    );
  }

  const result = await prisma.semesterRegistration.create({
    data,
  });

  return result;
};

const getAllSemesterRegistration = async (
  filters: ISemesterRegistrationFilterRequest,
  options: IPaginationOptions
): Promise<IGenericResponse<SemesterRegistration[]>> => {
  const { limit, page, skip } = paginationHelpers.calculatePagination(options);
  const { searchTerm, ...filtersData } = filters;

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      OR: SemesterRegistrationSearchAbleFields.map(field => ({
        [field]: {
          contains: searchTerm,
          mode: 'insensitive',
        },
      })),
    });
  }

  if (Object.keys(filtersData).length > 0) {
    andConditions.push({
      AND: Object.keys(filtersData).map(key => {
        if (semesterRegistrationRelationalFields.includes(key)) {
          return {
            [semesterRegistrationRelationalFieldsMapper[key]]: {
              id: (filtersData as any)[key],
            },
          };
        } else {
          return {
            [key]: {
              equals: (filtersData as any)[key],
            },
          };
        }
      }),
    });
  }

  const whereConditions: Prisma.SemesterRegistrationWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.semesterRegistration.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? { [options.sortBy]: options.sortOrder }
        : { createdAt: 'desc' },
  });

  const total = await prisma.semesterRegistration.count();
  return {
    meta: {
      total,
      page,
      limit,
    },
    data: result,
  };
};

const getSingleSemesterRegistration = async (
  id: string
): Promise<SemesterRegistration | null> => {
  const result = await prisma.semesterRegistration.findUnique({
    where: { id },
    include: {
      academicSemester: true,
    },
  });

  if (!result) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      "SemesterRegistration Doesn't Exists"
    );
  }

  return result;
};

const updateSingleSemesterRegistration = async (
  id: string,
  payload: Partial<SemesterRegistration>
): Promise<SemesterRegistration | null> => {
  const isExists = await prisma.semesterRegistration.findUnique({
    where: { id },
  });

  if (!isExists) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      "SemesterRegistration Doesn't Exists"
    );
  }

  //! we should not able to turn a semester registration from UPCOMING to END. It should be UPCOMING --> ONGOING --> ENDED

  // first we are handling upcoming-->ongoing
  if (
    payload.status &&
    isExists.status === SemesterRegistrationStatus.UPCOMING &&
    payload.status !== SemesterRegistrationStatus.ONGOING
  ) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Can only move from UPCOMING to ONGOING'
    );
  }

  //now we are handling ongoing to ended
  if (
    payload.status &&
    isExists.status === SemesterRegistrationStatus.ONGOING &&
    payload.status !== SemesterRegistrationStatus.ENDED
  ) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Can only move from ONGOING to ENDED'
    );
  }

  const result = await prisma.semesterRegistration.update({
    where: { id },
    data: payload,
    include: {
      academicSemester: true,
    },
  });

  return result;
};

const deleteSingleSemesterRegistration = async (
  id: string
): Promise<SemesterRegistration> => {
  const isExists = await prisma.semesterRegistration.findUnique({
    where: { id },
  });

  if (!isExists) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      "SemesterRegistration Doesn't Exists"
    );
  }

  const result = await prisma.semesterRegistration.delete({
    where: { id },
    include: {
      academicSemester: true,
    },
  });

  return result;
};

const startMyRegistration = async (
  authUserId: string
): Promise<{
  semesterRegistration: SemesterRegistration | null;
  studentSemesterRegistration: StudentSemesterRegistration | null;
}> => {
  const studentInfo = await prisma.student.findFirst({
    where: {
      studentId: authUserId,
    },
  });

  if (!studentInfo)
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Student Information Not Found!'
    );

  const semesterRegistrationInfo = await prisma.semesterRegistration.findFirst({
    where: {
      status: {
        in: [
          SemesterRegistrationStatus.ONGOING,
          SemesterRegistrationStatus.UPCOMING,
        ],
      },
    },
  });

  if (
    semesterRegistrationInfo?.status === SemesterRegistrationStatus.UPCOMING
  ) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Registration is not started yet!'
    );
  }

  let studentRegistration = await prisma.studentSemesterRegistration.findFirst({
    where: {
      student: {
        id: studentInfo?.id,
      },
      semesterRegistration: {
        id: semesterRegistrationInfo?.id,
      },
    },
  });

  // if student is not make their registration previously then they can proceed for the registration.
  if (!studentRegistration) {
    studentRegistration = await prisma.studentSemesterRegistration.create({
      data: {
        //! here we are posting data into the relation of a table. check the schema and then you will notice that, we are trying to insert the data using the relation of a table instead of using the id(reference fields).

        // as student and semester registration both information is available so we can follow this approach using connect
        student: {
          connect: {
            id: studentInfo?.id,
          },
        },
        semesterRegistration: {
          connect: {
            id: semesterRegistrationInfo?.id,
          },
        },
      },
    });
  }

  return {
    semesterRegistration: semesterRegistrationInfo,
    studentSemesterRegistration: studentRegistration,
  };
};

const enrollIntoCourse = async (
  authUserId: string,
  payload: IEnrollCoursePayload
) => {
  const student = await prisma.student.findFirst({
    where: {
      studentId: authUserId,
    },
  });

  if (!student) throw new ApiError(httpStatus.NOT_FOUND, 'Student not found!');

  const semesterRegistration = await prisma.semesterRegistration.findFirst({
    where: {
      status: SemesterRegistrationStatus.ONGOING,
    },
  });

  if (!semesterRegistration)
    throw new ApiError(
      httpStatus.NOT_FOUND,
      'Semester Registration not found!'
    );

  const offeredCourse = await prisma.offeredCourse.findFirst({
    where: {
      id: payload.offeredCourseId,
    },
    include: {
      course: true,
    },
  });

  if (!offeredCourse)
    throw new ApiError(httpStatus.NOT_FOUND, 'Offered Course does not exists!');

  const offeredCourseSection = await prisma.offeredCourseSection.findFirst({
    where: {
      id: payload.offeredCourseSectionId,
    },
  });

  if (!offeredCourseSection)
    throw new ApiError(
      httpStatus.NOT_FOUND,
      'Offered Course Section does not exists!'
    );

  if (
    offeredCourseSection.maxCapacity &&
    offeredCourseSection.currentlyEnrolledStudent &&
    offeredCourseSection.currentlyEnrolledStudent >=
      offeredCourseSection.maxCapacity
  ) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Student Capacity is Full!');
  }

  await prisma.$transaction(async transaction => {
    await transaction.studentSemesterRegistrationCourse.create({
      data: {
        studentId: student?.id,
        semesterRegistrationId: semesterRegistration?.id,
        offeredCourseId: payload.offeredCourseId,
        offeredCourseSectionId: payload.offeredCourseSectionId,
      },
    });

    //if any student successfully semester into a course then we need to increase the total number of already student enrolled in that course as we have a property "already endrolled student" in offered course section

    await transaction.offeredCourseSection.update({
      where: {
        id: payload.offeredCourseSectionId,
      },
      data: {
        currentlyEnrolledStudent: {
          increment: 1,
        },
      },
    });

    //update total credits taken field for student after successfully enrolled into a course
    await transaction.studentSemesterRegistration.updateMany({
      where: {
        student: {
          id: student.id,
        },
        semesterRegistration: {
          id: semesterRegistration.id,
        },
      },
      data: {
        totalCreditsTaken: {
          increment: offeredCourse.course.credit,
        },
      },
    });
  });

  return {
    message: 'Successfully enrolled into course!!!',
  };
};

const withdrawFromCourse = async (
  authUserId: string,
  payload: IEnrollCoursePayload
) => {
  const student = await prisma.student.findFirst({
    where: {
      studentId: authUserId,
    },
  });

  if (!student) throw new ApiError(httpStatus.NOT_FOUND, 'Student not found!');

  const semesterRegistration = await prisma.semesterRegistration.findFirst({
    where: {
      status: SemesterRegistrationStatus.ONGOING,
    },
  });

  if (!semesterRegistration)
    throw new ApiError(
      httpStatus.NOT_FOUND,
      'Semester Registration not found!'
    );

  const offeredCourse = await prisma.offeredCourse.findFirst({
    where: {
      id: payload.offeredCourseId,
    },
    include: {
      course: true,
    },
  });

  if (!offeredCourse)
    throw new ApiError(httpStatus.NOT_FOUND, 'Offered Course does not exists!');

  await prisma.$transaction(async transaction => {
    await transaction.studentSemesterRegistrationCourse.delete({
      where: {
        semesterRegistrationId_studentId_offeredCourseId: {
          semesterRegistrationId: semesterRegistration?.id,
          studentId: student?.id,
          offeredCourseId: payload.offeredCourseId,
        },
      },
    });

    //if any student successfully withdraw from a course then we need to decrease the total number of already student enrolled in that course as we have a property "already endrolled student" in offered course section

    await transaction.offeredCourseSection.update({
      where: {
        id: payload.offeredCourseSectionId,
      },
      data: {
        currentlyEnrolledStudent: {
          decrement: 1,
        },
      },
    });

    //update total credits taken field for student after successfully enrolled into a course
    await transaction.studentSemesterRegistration.updateMany({
      where: {
        student: {
          id: student.id,
        },
        semesterRegistration: {
          id: semesterRegistration.id,
        },
      },
      data: {
        totalCreditsTaken: {
          decrement: offeredCourse.course.credit,
        },
      },
    });
  });

  return {
    message: 'Successfully withdraw from course!!!',
  };
};

export const SemesterRegistrationService = {
  createSemesterRegistration,
  getAllSemesterRegistration,
  getSingleSemesterRegistration,
  updateSingleSemesterRegistration,
  deleteSingleSemesterRegistration,
  startMyRegistration,
  enrollIntoCourse,
  withdrawFromCourse,
};
