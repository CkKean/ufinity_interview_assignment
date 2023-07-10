import Logger from '../config/logger';
import { StudentNotificationRequest, StudentRegisterRequest } from '../models/studentModel';
import { StudentService } from '../services/studentService';
import { TeacherService } from '../services/teacherService';
import { NextFunction, Request, RequestHandler, Response } from 'express';
import { matchedData } from 'express-validator';
import { StatusCodes } from 'http-status-codes';

const LOG = new Logger('studentController.ts');

export class StudentController {
  private teacherService = new TeacherService();
  private studentService = new StudentService();

  register: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { students, teacher } = matchedData(req) as StudentRegisterRequest;

      const teacherData = await this.teacherService.getByEmail(teacher);
      if (!teacherData.status) {
        throw teacherData.error;
      }

      const registerStudent = await this.studentService.register({
        students,
        teacherId: teacherData.data.teacher_id,
      });

      if (!registerStudent.status) {
        throw registerStudent.error;
      }

      res.sendStatus(StatusCodes.NO_CONTENT);
    } catch (error) {
      LOG.error(error);
      next(error);
    }
  };

  getCommonStudents: RequestHandler = async (req, res, next: NextFunction) => {
    try {
      const { teacher } = matchedData(req);

      const students = await this.studentService.getCommonStudent(teacher);

      if (!students.status) {
        throw students.error;
      }

      res.status(StatusCodes.OK).json({
        students: students.data,
      });
    } catch (error) {
      LOG.error(error);
      next(error);
    }
  };

  suspend: RequestHandler = async (req, res, next: NextFunction) => {
    try {
      const { student: studentEmail } = matchedData(req);

      const result = await this.studentService.suspend(studentEmail);

      if (!result.status) {
        throw result.error;
      }

      res.sendStatus(StatusCodes.NO_CONTENT);
    } catch (error) {
      LOG.error(error);
      next(error);
    }
  };

  getNotificationList: RequestHandler = async (
    req,
    res,
    next: NextFunction
  ) => {
    try {
      const { notification, teacher } = matchedData(
        req
      ) as StudentNotificationRequest;

      const teacherData = await this.teacherService.getByEmail(teacher);
      if (!teacherData.status) {
        throw teacherData.error;
      }

      const studentEmails =
        [
          ...new Set(
            notification.match(
              /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g
            )
          ),
        ] || [];

      const result = await this.studentService.getStudentNotificationList(
        teacherData.data.teacher_id,
        studentEmails
      );

      if (!result.status) {
        throw result.error;
      }

      res.status(StatusCodes.OK).json({
        recipients: result.data,
      });
    } catch (error) {
      LOG.error(error);
      next(error);
    }
  };
}
