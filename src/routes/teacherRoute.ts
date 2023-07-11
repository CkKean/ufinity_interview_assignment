import { TeacherController } from '../controllers/teacherController';
import errorHandler from '../middlewares/ruleErrorHandler';
import { teacherRule } from '../middlewares/rules/teacherRule';
import Express from 'express';

const teacherRoute = Express.Router();

teacherRoute.post(
  '/',
  teacherRule.forCreate,
  errorHandler,
  TeacherController.create
);

export default teacherRoute;
