import Express from 'express';
import { teacherRule } from '../middlewares/rules/teacherRule';
import errorHandler from '../middlewares/ruleErrorHandler';
import { TeacherController } from '../controllers/TeacherController';

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
