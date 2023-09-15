import { Course, CourseFaculty } from '@prisma/client';
import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { paginationFields } from '../../../constants/pagination';
import catchAsync from '../../../shared/catchAsync';
import pick from '../../../shared/pick';
import sendResponse from '../../../shared/sendResponse';
import { CourseFilterAbleFileds } from './course.constants';
import { CourseService } from './course.service';

const createCourse = catchAsync(async (req: Request, res: Response) => {
  const result = await CourseService.createCourse(req.body);

  sendResponse<Course>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Course Created Successfully',
    data: result,
  });
});

const getAllCourse = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, CourseFilterAbleFileds);
  const options = pick(req.query, paginationFields);

  const result = await CourseService.getAllCourse(filters, options);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Courses Retrieved Successfully',
    meta: result.meta,
    data: result.data,
  });
});

const getSingleCourse = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const result = await CourseService.getSingleCourse(id);

  sendResponse<Course>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Course Retrieved Successfully',
    data: result,
  });
});

const updateSingleCourse = catchAsync(async (req: Request, res: Response) => {
  const data = req.body;
  const id = req.params.id;
  const result = await CourseService.updateSingleCourse(id, data);

  sendResponse<Course>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Course Updated Successfully',
    data: result,
  });
});

const deleteSingleCourse = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const result = await CourseService.deleteSingleCourse(id);

  sendResponse<Course>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Course Deleted Successfully',
    data: result,
  });
});

const assignCourseFaculty = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await CourseService.assignCourseFaculty(
    id,
    req.body.faculties
  );

  sendResponse<CourseFaculty[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Course Faculty Assigned Successfully',
    data: result,
  });
});

const removeCourseFaculty = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await CourseService.removeCourseFaculty(
    id,
    req.body.faculties
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Course Faculty Removed Successfully',
    data: result,
  });
});

export const CourseController = {
  createCourse,
  getAllCourse,
  getSingleCourse,
  updateSingleCourse,
  deleteSingleCourse,
  assignCourseFaculty,
  removeCourseFaculty,
};
