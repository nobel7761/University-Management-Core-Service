"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const academicDepartment_routes_1 = require("../modules/academicDepartment/academicDepartment.routes");
const academicFaculty_routes_1 = require("../modules/academicFaculty/academicFaculty.routes");
const academicSemester_route_1 = require("../modules/academicSemester/academicSemester.route");
const building_routes_1 = require("../modules/building/building.routes");
const course_routes_1 = require("../modules/course/course.routes");
const faculty_routes_1 = require("../modules/faculty/faculty.routes");
const offeredCourse_routes_1 = require("../modules/offeredCourse/offeredCourse.routes");
const offeredCourseClassSchedule_routes_1 = require("../modules/offeredCourseClassSchedule/offeredCourseClassSchedule.routes");
const offeredCourseSection_routes_1 = require("../modules/offeredCourseSection/offeredCourseSection.routes");
const room_routes_1 = require("../modules/room/room.routes");
const semesterRegistration_routes_1 = require("../modules/semesterRegistration/semesterRegistration.routes");
const student_routes_1 = require("../modules/student/student.routes");
const router = express_1.default.Router();
const moduleRoutes = [
    {
        path: '/academic-semesters',
        route: academicSemester_route_1.AcademicSemesterRoutes,
    },
    {
        path: '/academic-departments',
        route: academicDepartment_routes_1.AcademicDepartmentRoutes,
    },
    {
        path: '/academic-faculties',
        route: academicFaculty_routes_1.AcademicFacultyRoutes,
    },
    {
        path: '/faculties',
        route: faculty_routes_1.FacultyRoutes,
    },
    {
        path: '/students',
        route: student_routes_1.StudentRoutes,
    },
    {
        path: '/buildings',
        route: building_routes_1.BuildingRoutes,
    },
    {
        path: '/rooms',
        route: room_routes_1.RoomRoutes,
    },
    {
        path: '/courses',
        route: course_routes_1.CourseRoutes,
    },
    {
        path: '/semester-registration',
        route: semesterRegistration_routes_1.SemesterRegistrationRoutes,
    },
    {
        path: '/offered-courses',
        route: offeredCourse_routes_1.OfferedCourseRoutes,
    },
    {
        path: '/offered-course-sections',
        route: offeredCourseSection_routes_1.OfferedCourseSectionRoutes,
    },
    {
        path: '/offered-course-class-schedules',
        route: offeredCourseClassSchedule_routes_1.OfferedCourseClassScheduleRoutes,
    },
];
moduleRoutes.forEach(route => router.use(route.path, route.route));
exports.default = router;
