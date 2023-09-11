import { AcademicSemester } from '@prisma/client';
import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import prisma from '../../../shared/prisma';
import { academicSemesterTitleCodeMapper } from './academicSemester.constant';

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

export const AcademicSemesterService = {
  createAcademicSemester,
};
