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
exports.OfferedCourseController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const pagination_1 = require("../../../constants/pagination");
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const pick_1 = __importDefault(require("../../../shared/pick"));
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const offeredCourse_constants_1 = require("./offeredCourse.constants");
const offeredCourse_service_1 = require("./offeredCourse.service");
const createOfferedCourse = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield offeredCourse_service_1.OfferedCourseService.createOfferedCourse(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'OfferedCourse Completed Successfully',
        data: result,
    });
}));
const getAllOfferedCourse = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const filters = (0, pick_1.default)(req.query, offeredCourse_constants_1.OfferedCourseFilterAbleFileds);
    const options = (0, pick_1.default)(req.query, pagination_1.paginationFields);
    const result = yield offeredCourse_service_1.OfferedCourseService.getAllOfferedCourse(filters, options);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'All OfferedCourse Retrieved Successfully',
        data: result,
    });
}));
const getSingleOfferedCourse = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const result = yield offeredCourse_service_1.OfferedCourseService.getSingleOfferedCourse(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'OfferedCourse Retrieved Successfully',
        data: result,
    });
}));
const updateSingleOfferedCourse = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const payload = req.body;
    const id = req.params.id;
    const result = yield offeredCourse_service_1.OfferedCourseService.updateSingleOfferedCourse(id, payload);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'OfferedCourse Updated Successfully',
        data: result,
    });
}));
const deleteSingleOfferedCourse = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const result = yield offeredCourse_service_1.OfferedCourseService.deleteSingleOfferedCourse(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'OfferedCourse Deleted Successfully',
        data: result,
    });
}));
exports.OfferedCourseController = {
    createOfferedCourse,
    getAllOfferedCourse,
    getSingleOfferedCourse,
    updateSingleOfferedCourse,
    deleteSingleOfferedCourse,
};
