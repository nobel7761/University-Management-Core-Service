"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AcademicSemesterRoutes = void 0;
const express_1 = __importDefault(require("express"));
const user_1 = require("../../../enums/user");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const academicSemester_controller_1 = require("./academicSemester.controller");
const academicSemester_validation_1 = require("./academicSemester.validation");
const router = express_1.default.Router();
router.post('/', (0, auth_1.default)(user_1.ENUM_USER_ROLE.SUPER_ADMIN, user_1.ENUM_USER_ROLE.ADMIN), (0, validateRequest_1.default)(academicSemester_validation_1.AcademicSemesterValidation.createAcademicSemesterZodValidation), academicSemester_controller_1.AcademicSemesterController.createAcademicSemester);
router.get('/', academicSemester_controller_1.AcademicSemesterController.getAllAcademicSemester);
router.get('/:id', academicSemester_controller_1.AcademicSemesterController.getSingleAcademicSemester);
router.patch('/:id', (0, auth_1.default)(user_1.ENUM_USER_ROLE.SUPER_ADMIN, user_1.ENUM_USER_ROLE.ADMIN), (0, validateRequest_1.default)(academicSemester_validation_1.AcademicSemesterValidation.updateAcademicSemesterZodValidation), academicSemester_controller_1.AcademicSemesterController.updateSingleAcademicSemester);
router.delete('/:id', (0, auth_1.default)(user_1.ENUM_USER_ROLE.SUPER_ADMIN, user_1.ENUM_USER_ROLE.ADMIN), academicSemester_controller_1.AcademicSemesterController.deleteSingleAcademicSemester);
exports.AcademicSemesterRoutes = router;
