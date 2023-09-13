/* eslint-disable @typescript-eslint/no-explicit-any */
import { AcademicFaculty, Prisma } from '@prisma/client';
import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import prisma from '../../../shared/prisma';
import { IPaginationOptions } from './../../../interfaces/pagination';
import { AcademicFacultySearchAbleFields } from './academicFaculty.constants';
import { IAcademicFacultyFilterRequest } from './academicFaculty.interfaces';

const createAcademicFaculty = async (
  data: AcademicFaculty
): Promise<AcademicFaculty> => {
  const result = await prisma.academicFaculty.create({
    data,
  });

  return result;
};

const getAllAcademicFaculty = async (
  filters: IAcademicFacultyFilterRequest,
  options: IPaginationOptions
): Promise<IGenericResponse<AcademicFaculty[]>> => {
  const { limit, page, skip } = paginationHelpers.calculatePagination(options);
  const { searchTerm, ...filtersData } = filters;

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      OR: AcademicFacultySearchAbleFields.map(field => ({
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

  const whereConditions: Prisma.AcademicFacultyWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.academicFaculty.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? { [options.sortBy]: options.sortOrder }
        : { createdAt: 'desc' },
  });

  const total = await prisma.academicFaculty.count();
  return {
    meta: {
      total,
      page,
      limit,
    },
    data: result,
  };
};

const getSingleAcademicFaculty = async (
  id: string
): Promise<AcademicFaculty | null> => {
  const result = await prisma.academicFaculty.findUnique({
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

const updateSingleAcademicFaculty = async (
  data: Partial<AcademicFaculty>,
  id: string
): Promise<AcademicFaculty | null> => {
  const isExists = await prisma.academicFaculty.findUnique({
    where: { id },
  });

  if (!isExists) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      "Academic Semester Doesn't Exists"
    );
  }

  const result = await prisma.academicFaculty.update({
    where: { id },
    data,
  });

  return result;
};

const deleteSingleAcademicFaculty = async (
  id: string
): Promise<AcademicFaculty> => {
  const result = await prisma.academicFaculty.delete({
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

export const AcademicFacultyService = {
  createAcademicFaculty,
  getAllAcademicFaculty,
  getSingleAcademicFaculty,
  updateSingleAcademicFaculty,
  deleteSingleAcademicFaculty,
};
