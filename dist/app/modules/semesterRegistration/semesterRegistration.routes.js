"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SemesterRegistrationRoutes = void 0;
const express_1 = __importDefault(require("express"));
const user_1 = require("../../../enums/user");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const semesterRegistration_controller_1 = require("./semesterRegistration.controller");
const semesterRegistration_validation_1 = require("./semesterRegistration.validation");
const router = express_1.default.Router();
router.get('/', semesterRegistration_controller_1.SemesterRegistrationController.getAllSemesterRegistration);
router.get('/:id', semesterRegistration_controller_1.SemesterRegistrationController.getSingleSemesterRegistration);
router.post('/', (0, validateRequest_1.default)(semesterRegistration_validation_1.SemesterRegistrationValidation.createSemesterRegistrationZodValidation), (0, auth_1.default)(user_1.ENUM_USER_ROLE.SUPER_ADMIN, user_1.ENUM_USER_ROLE.ADMIN), semesterRegistration_controller_1.SemesterRegistrationController.createSemesterRegistration);
router.patch('/:id', (0, validateRequest_1.default)(semesterRegistration_validation_1.SemesterRegistrationValidation.updateSemesterRegistrationZodValidation), (0, auth_1.default)(user_1.ENUM_USER_ROLE.SUPER_ADMIN, user_1.ENUM_USER_ROLE.ADMIN), semesterRegistration_controller_1.SemesterRegistrationController.updateSingleSemesterRegistration);
router.delete('/:id', (0, auth_1.default)(user_1.ENUM_USER_ROLE.SUPER_ADMIN, user_1.ENUM_USER_ROLE.ADMIN), semesterRegistration_controller_1.SemesterRegistrationController.deleteSingleSemesterRegistration);
exports.SemesterRegistrationRoutes = router;
