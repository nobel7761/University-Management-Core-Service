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
router.patch(
  '/:id',
  validateRequest(
    AcademicSemesterValidation.updateAcademicSemesterZodValidation
  ),
  AcademicSemesterController.updateSingleAcademicSemester
);
router.delete('/:id', AcademicSemesterController.deleteSingleAcademicSemester);

export const AcademicSemesterRoutes = router;
