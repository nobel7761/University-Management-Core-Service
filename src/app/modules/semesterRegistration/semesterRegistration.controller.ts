/* eslint-disable @typescript-eslint/no-explicit-any */
import { SemesterRegistration } from '@prisma/client';
import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { paginationFields } from '../../../constants/pagination';
import catchAsync from '../../../shared/catchAsync';
import pick from '../../../shared/pick';
import sendResponse from '../../../shared/sendResponse';
import { SemesterRegistrationFilterAbleFileds } from './semesterRegistration.constants';
import { SemesterRegistrationService } from './semesterRegistration.service';

const createSemesterRegistration = catchAsync(
  async (req: Request, res: Response) => {
    const result = await SemesterRegistrationService.createSemesterRegistration(
      req.body
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'SemesterRegistration Completed Successfully',
      data: result,
    });
  }
);

const getAllSemesterRegistration = catchAsync(
  async (req: Request, res: Response) => {
    const filters = pick(req.query, SemesterRegistrationFilterAbleFileds);
    const options = pick(req.query, paginationFields);

    const result = await SemesterRegistrationService.getAllSemesterRegistration(
      filters,
      options
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'All Academic SemesterRegistration Retrieved Successfully',
      data: result,
    });
  }
);

const getSingleSemesterRegistration = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.params.id;
    const result =
      await SemesterRegistrationService.getSingleSemesterRegistration(id);

    sendResponse<SemesterRegistration>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'SemesterRegistration Retrieved Successfully',
      data: result,
    });
  }
);

const updateSingleSemesterRegistration = catchAsync(
  async (req: Request, res: Response) => {
    const payload = req.body;
    const id = req.params.id;
    const result =
      await SemesterRegistrationService.updateSingleSemesterRegistration(
        id,
        payload
      );

    sendResponse<SemesterRegistration>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'SemesterRegistration Updated Successfully',
      data: result,
    });
  }
);

const deleteSingleSemesterRegistration = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.params.id;
    const result =
      await SemesterRegistrationService.deleteSingleSemesterRegistration(id);

    sendResponse<SemesterRegistration>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'SemesterRegistration Deleted Successfully',
      data: result,
    });
  }
);

const startMyRegistration = catchAsync(async (req: Request, res: Response) => {
  const user = (req as any).user;
  const result = await SemesterRegistrationService.startMyRegistration(
    user.userId
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Student SemesterRegistration started Successfully',
    data: result,
  });
});

const enrollIntoCourse = catchAsync(async (req: Request, res: Response) => {
  const user = (req as any).user;

  const result = await SemesterRegistrationService.enrollIntoCourse(
    user.userId,
    req.body
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Student SemesterRegistration course enrolled Successfully',
    data: result,
  });
});

const withdrawFromCourse = catchAsync(async (req: Request, res: Response) => {
  const user = (req as any).user;

  const result = await SemesterRegistrationService.enrollIntoCourse(
    user.userId,
    req.body
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Student withdraw from course Successfully',
    data: result,
  });
});

export const SemesterRegistrationController = {
  createSemesterRegistration,
  getAllSemesterRegistration,
  getSingleSemesterRegistration,
  updateSingleSemesterRegistration,
  deleteSingleSemesterRegistration,
  startMyRegistration,
  enrollIntoCourse,
  withdrawFromCourse,
};
