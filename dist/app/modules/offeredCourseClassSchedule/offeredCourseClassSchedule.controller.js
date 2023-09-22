"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OfferedCourseClassScheduleController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const pagination_1 = require("../../../constants/pagination");
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const pick_1 = __importDefault(require("../../../shared/pick"));
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const offeredCourseSection_constants_1 = require("../offeredCourseSection/offeredCourseSection.constants");
const offeredCourseClassSchedule_service_1 = require("./offeredCourseClassSchedule.service");
const createOfferedCourseClassSchedule = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield offeredCourseClassSchedule_service_1.OfferedCourseClassScheduleService.createOfferedCourseClassSchedule(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'OfferedCourseClassSchedule Completed Successfully',
        data: result,
    });
}));
const getAllOfferedCourseClassSchedule = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const filters = (0, pick_1.default)(req.query, offeredCourseSection_constants_1.offeredCourseSectionFilterableFields);
    const options = (0, pick_1.default)(req.query, pagination_1.paginationFields);
    const result = yield offeredCourseClassSchedule_service_1.OfferedCourseClassScheduleService.getAllOfferedCourseClassSchedule(filters, options);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'All OfferedCourseClassSchedule Retrieved Successfully',
        data: result,
    });
}));
const getSingleOfferedCourseClassSchedule = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const result = yield offeredCourseClassSchedule_service_1.OfferedCourseClassScheduleService.getSingleOfferedCourseClassSchedule(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'OfferedCourseClassSchedule Retrieved Successfully',
        data: result,
    });
}));
const updateSingleOfferedCourseClassSchedule = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const payload = req.body;
    const id = req.params.id;
    const result = yield offeredCourseClassSchedule_service_1.OfferedCourseClassScheduleService.updateSingleOfferedCourseClassSchedule(id, payload);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'OfferedCourseClassSchedule Updated Successfully',
        data: result,
    });
}));
const deleteSingleOfferedCourseClassSchedule = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const result = yield offeredCourseClassSchedule_service_1.OfferedCourseClassScheduleService.deleteSingleOfferedCourseClassSchedule(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'OfferedCourseClassSchedule Deleted Successfully',
        data: result,
    });
}));
exports.OfferedCourseClassScheduleController = {
    createOfferedCourseClassSchedule,
    getAllOfferedCourseClassSchedule,
    getSingleOfferedCourseClassSchedule,
    updateSingleOfferedCourseClassSchedule,
    deleteSingleOfferedCourseClassSchedule,
};
