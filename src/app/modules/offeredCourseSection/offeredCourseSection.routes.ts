import express from 'express';
import { ENUM_USER_ROLE } from '../../../enums/user';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { OfferedCourseSectionController } from './offeredCourseSection.controller';
import { OfferedCourseSectionValidation } from './offeredCourseSection.validation';

const router = express.Router();

router.get('/', OfferedCourseSectionController.getAllOfferedCourseSection);

router.get(
  '/:id',
  OfferedCourseSectionController.getSingleOfferedCourseSection
);

router.post(
  '/',
  validateRequest(
    OfferedCourseSectionValidation.createOfferedCourseSectionZodValidation
  ),
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  OfferedCourseSectionController.createOfferedCourseSection
);

router.patch(
  '/:id',
  validateRequest(
    OfferedCourseSectionValidation.updateOfferedCourseSectionZodValidation
  ),
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  OfferedCourseSectionController.updateSingleOfferedCourseSection
);

router.delete(
  '/:id',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  OfferedCourseSectionController.deleteSingleOfferedCourseSection
);

export const OfferedCourseSectionRoutes = router;
