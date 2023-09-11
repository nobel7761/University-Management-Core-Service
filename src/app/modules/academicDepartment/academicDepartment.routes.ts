import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { AcademicDepartmentController } from './academicDepartment.controller';
import { AcademicDepartmentValidation } from './academicDepartment.validation';

const router = express.Router();

router.post(
  '/',
  validateRequest(
    AcademicDepartmentValidation.createAcademicDepartmentZodValidation
  ),
  AcademicDepartmentController.createAcademicDepartment
);

router.get('/', AcademicDepartmentController.getAllAcademicDepartment);
router.get('/:id', AcademicDepartmentController.getSingleAcademicDepartment);
router.patch(
  '/:id',
  validateRequest(
    AcademicDepartmentValidation.updateAcademicDepartmentZodValidation
  ),
  AcademicDepartmentController.updateSingleAcademicDepartment
);
router.delete(
  '/:id',
  AcademicDepartmentController.deleteSingleAcademicDepartment
);

export const AcademicDepartmentRoutes = router;
