import Express from 'express';
import { TeacherController } from '../controllers/teacherController';
import { teacherRule } from '../middlewares/rules/teacherRule';
import errorHandler from '../middlewares/ruleErrorHandler';

const teacherRoute = Express.Router();

teacherRoute.post(
  '/',
  teacherRule.forCreate,
  errorHandler,
  TeacherController.create
);

export default teacherRoute;
