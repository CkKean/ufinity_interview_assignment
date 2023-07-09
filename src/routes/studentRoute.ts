import Express from 'express';
import { studentRule } from '../middlewares/rules/studentRule';
import errorHandler from '../middlewares/ruleErrorHandler';
import { StudentController } from '../controllers/studentController';

class StudentRoute {
  studentRoute = Express.Router();
  
  private studentController = new StudentController();

  constructor() {
    this.studentRoute.post(
      '/register',
      studentRule.forRegister,
      errorHandler,
      this.studentController.register
    );
    this.studentRoute.get(
      '/commonstudents',
      studentRule.forCommonStudents,
      errorHandler,
      this.studentController.getCommonStudents
    );
    this.studentRoute.post(
      '/suspend',
      studentRule.forSuspend,
      errorHandler,
      this.studentController.suspend
    );
    this.studentRoute.post(
      '/retrievefornotifications',
      studentRule.forRetrieveNotifications,
      errorHandler,
      this.studentController.getNotificationList
    );
  }
}

export default new StudentRoute();
