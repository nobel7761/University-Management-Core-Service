"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CourseRoutes = void 0;
const express_1 = __importDefault(require("express"));
const user_1 = require("../../../enums/user");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const course_controller_1 = require("./course.controller");
const course_validation_1 = require("./course.validation");
const router = express_1.default.Router();
router.post('/', (0, auth_1.default)(user_1.ENUM_USER_ROLE.SUPER_ADMIN, user_1.ENUM_USER_ROLE.ADMIN), (0, validateRequest_1.default)(course_validation_1.CourseValidation.createCourseZodValidation), course_controller_1.CourseController.createCourse);
router.get('/', course_controller_1.CourseController.getAllCourse);
router.get('/withFaculties', course_controller_1.CourseController.getAllCourseWithFaculty);
router.get('/:id', course_controller_1.CourseController.getSingleCourse);
router.patch('/:id', (0, auth_1.default)(user_1.ENUM_USER_ROLE.SUPER_ADMIN, user_1.ENUM_USER_ROLE.ADMIN), (0, validateRequest_1.default)(course_validation_1.CourseValidation.updateCourseZodValidation), course_controller_1.CourseController.updateSingleCourse);
router.delete('/:id', (0, auth_1.default)(user_1.ENUM_USER_ROLE.SUPER_ADMIN, user_1.ENUM_USER_ROLE.ADMIN), course_controller_1.CourseController.deleteSingleCourse);
router.post('/:id/assign-faculties', (0, auth_1.default)(user_1.ENUM_USER_ROLE.SUPER_ADMIN, user_1.ENUM_USER_ROLE.ADMIN), (0, validateRequest_1.default)(course_validation_1.CourseValidation.assignOrRemoveFaculties), course_controller_1.CourseController.assignCourseFaculty);
router.delete('/:id/remove-faculties', (0, auth_1.default)(user_1.ENUM_USER_ROLE.SUPER_ADMIN, user_1.ENUM_USER_ROLE.ADMIN), (0, validateRequest_1.default)(course_validation_1.CourseValidation.assignOrRemoveFaculties), course_controller_1.CourseController.removeCourseFaculty);
router.get('/:id/faculties', course_controller_1.CourseController.getSingleCourseWithFaculty);
exports.CourseRoutes = router;
