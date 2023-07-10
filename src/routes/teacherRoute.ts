import { TeacherController } from '../controllers/teacherController';
import errorHandler from '../middlewares/ruleErrorHandler';
import { teacherRule } from '../middlewares/rules/teacherRule';
import Express from 'express';
class TeacherRoute {
  teacherRoute = Express.Router();

  private teacherController = new TeacherController();

  constructor() {
    this.teacherRoute.post(
      '/',
      teacherRule.forCreate,
      errorHandler,
      this.teacherController.create
    );
  }
}

export default new TeacherRoute();
