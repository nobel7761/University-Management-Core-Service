/* eslint-disable @typescript-eslint/no-explicit-any */
import { Faculty, Prisma } from '@prisma/client';
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

export const FacultyService = {
  createFaculty,
  getAllFaculty,
  getSingleFaculty,
  updateSingleFaculty,
  deleteSingleFaculty,
};
