/* eslint-disable @typescript-eslint/no-explicit-any */
import { AcademicSemester, Prisma } from '@prisma/client';
import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import prisma from '../../../shared/prisma';
import { IPaginationOptions } from './../../../interfaces/pagination';
import {
  AcademicSemesterSearchAbleFields,
  academicSemesterTitleCodeMapper,
} from './academicSemester.constant';
import { IAcademicSemeterFilterRequest } from './academicSemester.interface';

const createAcademicSemester = async (
  data: AcademicSemester
): Promise<AcademicSemester> => {
  if (academicSemesterTitleCodeMapper[data.title] !== data.code) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid Semester Code');
  }

  const result = await prisma.academicSemester.create({
    data,
  });

  return result;
};

const getAllAcademicSemester = async (
  filters: IAcademicSemeterFilterRequest,
  options: IPaginationOptions
): Promise<IGenericResponse<AcademicSemester[]>> => {
  const { limit, page, skip } = paginationHelpers.calculatePagination(options);
  const { searchTerm, ...filtersData } = filters;

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      OR: AcademicSemesterSearchAbleFields.map(field => ({
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

  const whereConditions: Prisma.AcademicSemesterWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.academicSemester.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? { [options.sortBy]: options.sortOrder }
        : { createdAt: 'desc' },
  });

  const total = await prisma.academicSemester.count();
  return {
    meta: {
      total,
      page,
      limit,
    },
    data: result,
  };
};

const getSingleAcademicSemester = async (
  id: string
): Promise<AcademicSemester | null> => {
  const result = await prisma.academicSemester.findUnique({
    where: { id },
  });

  if (!result) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      "Academic Semester Doesn't Exists"
    );
  }

  return result;
};

const updateSingleAcademicSemester = async (
  data: AcademicSemester,
  id: string
): Promise<AcademicSemester | null> => {
  const isExists = await prisma.academicSemester.findUnique({
    where: { id },
  });

  if (!isExists) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      "Academic Semester Doesn't Exists"
    );
  }

  const result = await prisma.academicSemester.update({
    where: { id },
    data,
  });

  return result;
};

const deleteSingleAcademicSemester = async (
  id: string
): Promise<AcademicSemester> => {
  const result = await prisma.academicSemester.delete({
    where: { id },
  });

  if (!result) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      "Academic Semester Doesn't Exists"
    );
  }

  return result;
};

export const AcademicSemesterService = {
  createAcademicSemester,
  getAllAcademicSemester,
  getSingleAcademicSemester,
  updateSingleAcademicSemester,
  deleteSingleAcademicSemester,
};
