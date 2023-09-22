/* eslint-disable @typescript-eslint/no-explicit-any */
import { OfferedCourseClassSchedule, Prisma } from '@prisma/client';
import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import prisma from '../../../shared/prisma';
import {
  offeredCourseClassScheduleRelationalFields,
  offeredCourseClassScheduleRelationalFieldsMapper,
  offeredCourseClassScheduleSearchableFields,
} from './offeredCourseClassSchedule.constants';
import { IOfferedCourseClassScheduleFilterRequiest } from './offeredCourseClassSchedule.interfaces';
import { OfferedCourseClassScheduleUtils } from './offeredCourseClassSchedule.utils';

const createOfferedCourseClassSchedule = async (
  data: any
): Promise<OfferedCourseClassSchedule> => {
  await OfferedCourseClassScheduleUtils.checkRoomAvailable(data);
  await OfferedCourseClassScheduleUtils.checkFacultyAvailable(data);

  const result = await prisma.offeredCourseClassSchedule.create({
    data,
  });

  return result;
};

const getAllOfferedCourseClassSchedule = async (
  filters: IOfferedCourseClassScheduleFilterRequiest,
  options: IPaginationOptions
): Promise<IGenericResponse<OfferedCourseClassSchedule[]>> => {
  const { limit, page, skip } = paginationHelpers.calculatePagination(options);
  const { searchTerm, ...filtersData } = filters;

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      OR: offeredCourseClassScheduleSearchableFields.map(field => ({
        [field]: {
          contains: searchTerm,
          mode: 'insensitive',
        },
      })),
    });
  }

  //! as we have to filter out data from another field that is why we have to add the relational field here!
  // we will only add table name(e.x: room) with the field(e.x: roomId) by which relation is creating!
  if (Object.keys(filtersData).length > 0) {
    andConditions.push({
      AND: Object.keys(filtersData).map(key => {
        // here we have to declare the fields
        if (offeredCourseClassScheduleRelationalFields.includes(key)) {
          return {
            // here we have to declare the table with fields where we will filter
            [offeredCourseClassScheduleRelationalFieldsMapper[key]]: {
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

  const whereConditions: Prisma.OfferedCourseClassScheduleWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.offeredCourseClassSchedule.findMany({
    where: whereConditions,
    include: {
      faculty: true,
      semesterRegistration: true,
      room: true,
      offeredCourseSection: true,
    },
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? { [options.sortBy]: options.sortOrder }
        : { createdAt: 'desc' },
  });

  const total = await prisma.offeredCourseClassSchedule.count();
  return {
    meta: {
      total,
      page,
      limit,
    },
    data: result,
  };
};

const getSingleOfferedCourseClassSchedule = async (
  id: string
): Promise<OfferedCourseClassSchedule | null> => {
  const result = await prisma.offeredCourseClassSchedule.findUnique({
    where: { id },
    include: {
      offeredCourseSection: true,
      faculty: true,
      room: true,
    },
  });

  if (!result) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      "OfferedCourseClassSchedule Doesn't Exists"
    );
  }

  return result;
};

const updateSingleOfferedCourseClassSchedule = async (
  id: string,
  payload: Partial<OfferedCourseClassSchedule>
): Promise<OfferedCourseClassSchedule | null> => {
  const isExists = await prisma.offeredCourseClassSchedule.findUnique({
    where: { id },
  });

  if (!isExists) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      "OfferedCourseClassSchedule Doesn't Exists"
    );
  }

  const result = await prisma.offeredCourseClassSchedule.update({
    where: { id },
    data: payload,
    include: {
      offeredCourseSection: true,
      faculty: true,
      room: true,
    },
  });

  return result;
};

const deleteSingleOfferedCourseClassSchedule = async (
  id: string
): Promise<OfferedCourseClassSchedule> => {
  const isExists = await prisma.offeredCourseClassSchedule.findUnique({
    where: { id },
  });

  if (!isExists) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      "OfferedCourseClassSchedule Doesn't Exists"
    );
  }

  const result = await prisma.offeredCourseClassSchedule.delete({
    where: { id },
    include: {
      offeredCourseSection: true,
      faculty: true,
      room: true,
    },
  });

  return result;
};

export const OfferedCourseClassScheduleService = {
  createOfferedCourseClassSchedule,
  getAllOfferedCourseClassSchedule,
  getSingleOfferedCourseClassSchedule,
  updateSingleOfferedCourseClassSchedule,
  deleteSingleOfferedCourseClassSchedule,
};
