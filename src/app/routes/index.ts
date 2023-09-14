import express from 'express';
import { AcademicDepartmentRoutes } from '../modules/academicDepartment/academicDepartment.routes';
import { AcademicFacultyRoutes } from '../modules/academicFaculty/academicFaculty.routes';
import { AcademicSemesterRoutes } from '../modules/academicSemester/academicSemester.route';
import { BuildingRoutes } from '../modules/building/building.routes';
import { FacultyRoutes } from '../modules/faculty/faculty.routes';
import { StudentRoutes } from '../modules/student/student.routes';

const router = express.Router();

const moduleRoutes = [
  {
    path: '/academic-semesters',
    route: AcademicSemesterRoutes,
  },
  {
    path: '/academic-departments',
    route: AcademicDepartmentRoutes,
  },
  {
    path: '/academic-faculties',
    route: AcademicFacultyRoutes,
  },
  {
    path: '/faculties',
    route: FacultyRoutes,
  },
  {
    path: '/students',
    route: StudentRoutes,
  },
  {
    path: '/buildings',
    route: BuildingRoutes,
  },
];

moduleRoutes.forEach(route => router.use(route.path, route.route));
export default router;
