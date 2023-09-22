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
exports.OfferedCourseSectionController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const pagination_1 = require("../../../constants/pagination");
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const pick_1 = __importDefault(require("../../../shared/pick"));
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const offeredCourseSection_constants_1 = require("./offeredCourseSection.constants");
const offeredCourseSection_service_1 = require("./offeredCourseSection.service");
const createOfferedCourseSection = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield offeredCourseSection_service_1.OfferedCourseSectionService.createOfferedCourseSection(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'OfferedCourseSection Completed Successfully',
        data: result,
    });
}));
const getAllOfferedCourseSection = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const filters = (0, pick_1.default)(req.query, offeredCourseSection_constants_1.offeredCourseSectionFilterableFields);
    const options = (0, pick_1.default)(req.query, pagination_1.paginationFields);
    const result = yield offeredCourseSection_service_1.OfferedCourseSectionService.getAllOfferedCourseSection(filters, options);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'All OfferedCourseSection Retrieved Successfully',
        data: result,
    });
}));
const getSingleOfferedCourseSection = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const result = yield offeredCourseSection_service_1.OfferedCourseSectionService.getSingleOfferedCourseSection(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'OfferedCourseSection Retrieved Successfully',
        data: result,
    });
}));
const updateSingleOfferedCourseSection = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const payload = req.body;
    const id = req.params.id;
    const result = yield offeredCourseSection_service_1.OfferedCourseSectionService.updateSingleOfferedCourseSection(id, payload);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'OfferedCourseSection Updated Successfully',
        data: result,
    });
}));
const deleteSingleOfferedCourseSection = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const result = yield offeredCourseSection_service_1.OfferedCourseSectionService.deleteSingleOfferedCourseSection(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'OfferedCourseSection Deleted Successfully',
        data: result,
    });
}));
exports.OfferedCourseSectionController = {
    createOfferedCourseSection,
    getAllOfferedCourseSection,
    getSingleOfferedCourseSection,
    updateSingleOfferedCourseSection,
    deleteSingleOfferedCourseSection,
};
