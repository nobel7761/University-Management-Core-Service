/* eslint-disable @typescript-eslint/no-explicit-any */
import { AcademicDepartment, Prisma } from '@prisma/client';
import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import prisma from '../../../shared/prisma';
import { IPaginationOptions } from './../../../interfaces/pagination';
import { AcademicDepartmentSearchAbleFields } from './academicDepartment.constants';
import { IAcademicDepartmentFilterRequest } from './academicDepartment.interfaces';

const createAcademicDepartment = async (
  data: AcademicDepartment
): Promise<AcademicDepartment> => {
  const result = await prisma.academicDepartment.create({
    data,
  });

  return result;
};

const getAllAcademicDepartment = async (
  filters: IAcademicDepartmentFilterRequest,
  options: IPaginationOptions
): Promise<IGenericResponse<AcademicDepartment[]>> => {
  const { limit, page, skip } = paginationHelpers.calculatePagination(options);
  const { searchTerm, ...filtersData } = filters;

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      OR: AcademicDepartmentSearchAbleFields.map(field => ({
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

  const whereConditions: Prisma.AcademicDepartmentWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.academicDepartment.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? { [options.sortBy]: options.sortOrder }
        : { createdAt: 'desc' },
  });

  const total = await prisma.academicDepartment.count();
  return {
    meta: {
      total,
      page,
      limit,
    },
    data: result,
  };
};

const getSingleAcademicDepartment = async (
  id: string
): Promise<AcademicDepartment | null> => {
  const result = await prisma.academicDepartment.findUnique({
    where: { id },
  });

  if (!result) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      "Academic Department Doesn't Exists"
    );
  }

  return result;
};

const updateSingleAcademicDepartment = async (
  data: AcademicDepartment,
  id: string
): Promise<AcademicDepartment | null> => {
  const isExists = await prisma.academicDepartment.findUnique({
    where: { id },
  });

  if (!isExists) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      "Academic Department Doesn't Exists"
    );
  }

  const result = await prisma.academicDepartment.update({
    where: { id },
    data,
  });

  return result;
};

const deleteSingleAcademicDepartment = async (
  id: string
): Promise<AcademicDepartment> => {
  const result = await prisma.academicDepartment.delete({
    where: { id },
  });

  if (!result) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      "Academic Department Doesn't Exists"
    );
  }

  return result;
};

export const AcademicDepartmentService = {
  createAcademicDepartment,
  getAllAcademicDepartment,
  getSingleAcademicDepartment,
  updateSingleAcademicDepartment,
  deleteSingleAcademicDepartment,
};