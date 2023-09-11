import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { AcademicSemesterController } from './academicSemester.controller';
import { AcademicSemesterValidation } from './academicSemester.validation';

const router = express.Router();

router.post(
  '/',
  validateRequest(
    AcademicSemesterValidation.createAcademicSemesterZodValidation
  ),
  AcademicSemesterController.createAcademicSemester
);

export const AcademicSemesterRoutes = router;
