import { AcademicSemester } from '@prisma/client';
import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { paginationFields } from '../../../constants/pagination';
import catchAsync from '../../../shared/catchAsync';
import pick from '../../../shared/pick';
import sendResponse from '../../../shared/sendResponse';
import { AcademicSemesterFilterAbleFileds } from './academicSemester.constant';
import { AcademicSemesterService } from './academicSemester.service';

const createAcademicSemester = catchAsync(
  async (req: Request, res: Response) => {
    const result = await AcademicSemesterService.createAcademicSemester(
      req.body
    );

    sendResponse<AcademicSemester>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Academic Semester Created Successfully',
      data: result,
    });
  }
);

const getAllAcademicSemester = catchAsync(
  async (req: Request, res: Response) => {
    const filters = pick(req.query, AcademicSemesterFilterAbleFileds);
    const options = pick(req.query, paginationFields);

    const result = await AcademicSemesterService.getAllAcademicSemester(
      filters,
      options
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Academic Semesters Retrieved Successfully',
      meta: result.meta,
      data: result.data,
    });
  }
);

const getSingleAcademicSemester = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.params.id;
    const result = await AcademicSemesterService.getSingleAcademicSemester(id);

    sendResponse<AcademicSemester>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Academic Semester Retrieved Successfully',
      data: result,
    });
  }
);

export const AcademicSemesterController = {
  createAcademicSemester,
  getAllAcademicSemester,
  getSingleAcademicSemester,
};
