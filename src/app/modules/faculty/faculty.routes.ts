import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { FacultyController } from './faculty.controller';
import { FacultyValidation } from './faculty.validation';

const router = express.Router();

router.post(
  '/',
  validateRequest(FacultyValidation.createFacultyZodValidation),
  FacultyController.createFaculty
);

router.get('/', FacultyController.getAllFaculty);
router.get('/:id', FacultyController.getSingleFaculty);
router.patch(
  '/:id',
  validateRequest(FacultyValidation.updateFacultyZodValidation),
  FacultyController.updateSingleFaculty
);
router.delete('/:id', FacultyController.deleteSingleFaculty);

export const FacultyRoutes = router;
