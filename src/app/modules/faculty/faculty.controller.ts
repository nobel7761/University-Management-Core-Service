import { Faculty } from '@prisma/client';
import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { paginationFields } from '../../../constants/pagination';
import catchAsync from '../../../shared/catchAsync';
import pick from '../../../shared/pick';
import sendResponse from '../../../shared/sendResponse';
import { FacultyFilterAbleFileds } from './faculty.constants';
import { FacultyService } from './faculty.service';

const createFaculty = catchAsync(async (req: Request, res: Response) => {
  const result = await FacultyService.createFaculty(req.body);

  sendResponse<Faculty>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Faculty Created Successfully',
    data: result,
  });
});

const getAllFaculty = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, FacultyFilterAbleFileds);
  const options = pick(req.query, paginationFields);

  const result = await FacultyService.getAllFaculty(filters, options);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Facultys Retrieved Successfully',
    meta: result.meta,
    data: result.data,
  });
});

const getSingleFaculty = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const result = await FacultyService.getSingleFaculty(id);

  sendResponse<Faculty>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Faculty Retrieved Successfully',
    data: result,
  });
});

const updateSingleFaculty = catchAsync(async (req: Request, res: Response) => {
  const data = req.body;
  const id = req.params.id;
  const result = await FacultyService.updateSingleFaculty(data, id);

  sendResponse<Faculty>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Faculty Updated Successfully',
    data: result,
  });
});

const deleteSingleFaculty = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const result = await FacultyService.deleteSingleFaculty(id);

  sendResponse<Faculty>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Faculty Deleted Successfully',
    data: result,
  });
});

const assignCoursesToFaculty = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    const result = await FacultyService.assignCoursesToFaculty(
      id,
      req.body.courses
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Courses Assigned Successfully',
      data: result,
    });
  }
);

const removeCoursesFromFaculty = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    const result = await FacultyService.removeCoursesFromFaculty(
      id,
      req.body.faculties
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Courses Removed Successfully',
      data: result,
    });
  }
);

export const FacultyController = {
  createFaculty,
  getAllFaculty,
  getSingleFaculty,
  updateSingleFaculty,
  deleteSingleFaculty,
  assignCoursesToFaculty,
  removeCoursesFromFaculty,
};
