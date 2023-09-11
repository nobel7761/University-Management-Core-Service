import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { AcademicFacultyController } from './academicFaculty.controller';
import { AcademicFacultyValidation } from './academicFaculty.validation';

const router = express.Router();

router.post(
  '/',
  validateRequest(AcademicFacultyValidation.createAcademicFacultyZodValidation),
  AcademicFacultyController.createAcademicFaculty
);

router.get('/', AcademicFacultyController.getAllAcademicFaculty);
router.get('/:id', AcademicFacultyController.getSingleAcademicFaculty);
router.patch(
  '/:id',
  validateRequest(AcademicFacultyValidation.updateAcademicFacultyZodValidation),
  AcademicFacultyController.updateSingleAcademicFaculty
);
router.delete('/:id', AcademicFacultyController.deleteSingleAcademicFaculty);

export const AcademicFacultyRoutes = router;
