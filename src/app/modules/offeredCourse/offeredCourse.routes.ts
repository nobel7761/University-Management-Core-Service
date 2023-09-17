import express from 'express';
import { ENUM_USER_ROLE } from '../../../enums/user';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { OfferedCourseController } from './offeredCourse.controller';
import { OfferedCourseValidation } from './offeredCourse.validation';

const router = express.Router();

router.get('/', OfferedCourseController.getAllOfferedCourse);

router.get('/:id', OfferedCourseController.getSingleOfferedCourse);

router.post(
  '/',
  validateRequest(OfferedCourseValidation.createOfferedCourseZodValidation),
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  OfferedCourseController.createOfferedCourse
);

router.patch(
  '/:id',
  validateRequest(OfferedCourseValidation.updateOfferedCourseZodValidation),
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  OfferedCourseController.updateSingleOfferedCourse
);

router.delete(
  '/:id',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  OfferedCourseController.deleteSingleOfferedCourse
);

export const OfferedCourseRoutes = router;
