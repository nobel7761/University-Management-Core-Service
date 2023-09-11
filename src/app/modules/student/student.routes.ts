import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { StudentController } from './student.controller';
import { StudentValidation } from './student.validation';

const router = express.Router();

router.post(
  '/',
  validateRequest(StudentValidation.createStudentZodValidation),
  StudentController.createStudent
);

router.get('/', StudentController.getAllStudent);
router.get('/:id', StudentController.getSingleStudent);
router.patch(
  '/:id',
  validateRequest(StudentValidation.updateStudentZodValidation),
  StudentController.updateSingleStudent
);
router.delete('/:id', StudentController.deleteSingleStudent);

export const StudentRoutes = router;
