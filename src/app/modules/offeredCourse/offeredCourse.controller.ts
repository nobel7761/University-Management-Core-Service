import { OfferedCourse } from '@prisma/client';
import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { paginationFields } from '../../../constants/pagination';
import catchAsync from '../../../shared/catchAsync';
import pick from '../../../shared/pick';
import sendResponse from '../../../shared/sendResponse';
import { OfferedCourseFilterAbleFileds } from './offeredCourse.constants';
import { OfferedCourseService } from './offeredCourse.service';

const createOfferedCourse = catchAsync(async (req: Request, res: Response) => {
  const result = await OfferedCourseService.createOfferedCourse(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'OfferedCourse Completed Successfully',
    data: result,
  });
});

const getAllOfferedCourse = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, OfferedCourseFilterAbleFileds);
  const options = pick(req.query, paginationFields);

  const result = await OfferedCourseService.getAllOfferedCourse(
    filters,
    options
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'All OfferedCourse Retrieved Successfully',
    data: result,
  });
});

const getSingleOfferedCourse = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.params.id;
    const result = await OfferedCourseService.getSingleOfferedCourse(id);

    sendResponse<OfferedCourse>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'OfferedCourse Retrieved Successfully',
      data: result,
    });
  }
);

const updateSingleOfferedCourse = catchAsync(
  async (req: Request, res: Response) => {
    const payload = req.body;
    const id = req.params.id;
    const result = await OfferedCourseService.updateSingleOfferedCourse(
      id,
      payload
    );

    sendResponse<OfferedCourse>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'OfferedCourse Updated Successfully',
      data: result,
    });
  }
);

const deleteSingleOfferedCourse = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.params.id;
    const result = await OfferedCourseService.deleteSingleOfferedCourse(id);

    sendResponse<OfferedCourse>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'OfferedCourse Deleted Successfully',
      data: result,
    });
  }
);

export const OfferedCourseController = {
  createOfferedCourse,
  getAllOfferedCourse,
  getSingleOfferedCourse,
  updateSingleOfferedCourse,
  deleteSingleOfferedCourse,
};
