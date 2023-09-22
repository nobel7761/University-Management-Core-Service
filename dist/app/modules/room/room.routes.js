"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoomRoutes = void 0;
const express_1 = __importDefault(require("express"));
const user_1 = require("../../../enums/user");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const room_controller_1 = require("./room.controller");
const room_validation_1 = require("./room.validation");
const router = express_1.default.Router();
router.post('/', (0, auth_1.default)(user_1.ENUM_USER_ROLE.SUPER_ADMIN, user_1.ENUM_USER_ROLE.ADMIN), (0, validateRequest_1.default)(room_validation_1.RoomValidation.createRoomZodValidation), room_controller_1.RoomController.createRoom);
router.get('/', room_controller_1.RoomController.getAllRoom);
router.get('/:id', room_controller_1.RoomController.getSingleRoom);
router.patch('/:id', (0, auth_1.default)(user_1.ENUM_USER_ROLE.SUPER_ADMIN, user_1.ENUM_USER_ROLE.ADMIN), (0, validateRequest_1.default)(room_validation_1.RoomValidation.updateRoomZodValidation), room_controller_1.RoomController.updateSingleRoom);
router.delete('/:id', (0, auth_1.default)(user_1.ENUM_USER_ROLE.SUPER_ADMIN, user_1.ENUM_USER_ROLE.ADMIN), room_controller_1.RoomController.deleteSingleRoom);
exports.RoomRoutes = router;
