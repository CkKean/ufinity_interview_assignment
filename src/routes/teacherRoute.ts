import Express from 'express';
import { TeacherController } from '../controllers/teacherController';
import { teacherRule } from '../rules/teacherRule';
import errorHandler from '../utils/errorHandler';

const teacherRoute = Express.Router();

teacherRoute.post(
  '/',
  teacherRule.forCreate,
  errorHandler,
  TeacherController.create
);

export default teacherRoute;
