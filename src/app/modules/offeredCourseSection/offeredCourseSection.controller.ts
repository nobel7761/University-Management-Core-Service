import { OfferedCourseSection } from '@prisma/client';
import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { paginationFields } from '../../../constants/pagination';
import catchAsync from '../../../shared/catchAsync';
import pick from '../../../shared/pick';
import sendResponse from '../../../shared/sendResponse';
import { offeredCourseSectionFilterableFields } from './offeredCourseSection.constants';
import { OfferedCourseSectionService } from './offeredCourseSection.service';

const createOfferedCourseSection = catchAsync(
  async (req: Request, res: Response) => {
    const result = await OfferedCourseSectionService.createOfferedCourseSection(
      req.body
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'OfferedCourseSection Completed Successfully',
      data: result,
    });
  }
);

const getAllOfferedCourseSection = catchAsync(
  async (req: Request, res: Response) => {
    const filters = pick(req.query, offeredCourseSectionFilterableFields);
    const options = pick(req.query, paginationFields);

    const result = await OfferedCourseSectionService.getAllOfferedCourseSection(
      filters,
      options
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'All OfferedCourseSection Retrieved Successfully',
      data: result,
    });
  }
);

const getSingleOfferedCourseSection = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.params.id;
    const result =
      await OfferedCourseSectionService.getSingleOfferedCourseSection(id);

    sendResponse<OfferedCourseSection>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'OfferedCourseSection Retrieved Successfully',
      data: result,
    });
  }
);

const updateSingleOfferedCourseSection = catchAsync(
  async (req: Request, res: Response) => {
    const payload = req.body;
    const id = req.params.id;
    const result =
      await OfferedCourseSectionService.updateSingleOfferedCourseSection(
        id,
        payload
      );

    sendResponse<OfferedCourseSection>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'OfferedCourseSection Updated Successfully',
      data: result,
    });
  }
);

const deleteSingleOfferedCourseSection = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.params.id;
    const result =
      await OfferedCourseSectionService.deleteSingleOfferedCourseSection(id);

    sendResponse<OfferedCourseSection>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'OfferedCourseSection Deleted Successfully',
      data: result,
    });
  }
);

export const OfferedCourseSectionController = {
  createOfferedCourseSection,
  getAllOfferedCourseSection,
  getSingleOfferedCourseSection,
  updateSingleOfferedCourseSection,
  deleteSingleOfferedCourseSection,
};
