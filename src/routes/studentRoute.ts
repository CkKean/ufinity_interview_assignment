import Express from 'express';
import { studentRule } from '../middlewares/rules/studentRule';
import errorHandler from '../middlewares/ruleErrorHandler';
import { StudentController } from '../controllers/studentController';

const studentRoute = Express.Router();

studentRoute.post(
  '/register',
  studentRule.forRegister,
  errorHandler,
  StudentController.register
);
studentRoute.get(
  '/commonstudents',
  studentRule.forCommonStudents,
  errorHandler,
  StudentController.getCommonStudents
);
studentRoute.post(
  '/suspend',
  studentRule.forSuspend,
  errorHandler,
  StudentController.suspend
);
studentRoute.post(
  '/retrievefornotifications',
  studentRule.forRetrieveNotifications,
  errorHandler,
  StudentController.getNotificationList
);

export default studentRoute;
