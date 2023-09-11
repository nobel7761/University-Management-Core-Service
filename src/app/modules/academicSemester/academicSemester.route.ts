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

router.get('/', AcademicSemesterController.getAllAcademicSemester);
router.get('/:id', AcademicSemesterController.getSingleAcademicSemester);

export const AcademicSemesterRoutes = router;
