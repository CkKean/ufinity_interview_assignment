import { NextFunction, Request, RequestHandler, Response } from 'express';
import { matchedData } from 'express-validator';
import { StatusCodes } from 'http-status-codes';
import Logger from '../config/logger';
import {
  StudentNotificationRequest,
  StudentRegisterRequest,
} from '../models/studentModel';
import { StudentService } from '../services/studentService';
import { TeacherService } from '../services/teacherService';
import ValidationHandler from '../utils/validationHandler';

const LOG = new Logger('studentController.ts');

const teacherService = new TeacherService();
const studentService = new StudentService();

const register: RequestHandler = async (req, res, next: NextFunction) => {
  try {
    const { students, teacher } = matchedData(req) as StudentRegisterRequest;

    const teacherData = await teacherService.getByEmail(teacher);

    if (!teacherData.status) {
      throw teacherData.error;
    }

    const registerStudent = await studentService.register({
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

const getCommonStudents: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { teacher } = matchedData(req);

    const students = await studentService.getCommonStudent(
      Array.isArray(teacher) ? teacher : [teacher]
    );

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

const suspend: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { student: studentEmail } = matchedData(req);

    const result = await studentService.suspend(studentEmail);

    if (!result.status) {
      throw result.error;
    }

    res.sendStatus(StatusCodes.NO_CONTENT);
  } catch (error) {
    LOG.error(error);
    next(error);
  }
};

const getNotificationList: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { notification, teacher } = matchedData(
      req
    ) as StudentNotificationRequest;

    const teacherData = await teacherService.getByEmail(teacher);
    if (!teacherData.status) {
      throw teacherData.error;
    }

    // const studentEmails =
    // [
    //   ...new Set(
    //     notification.match(
    //       /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g
    //       /[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]{2,}/
    //     )
    //   ),
    // ] || [];

    const studentEmails =
      [...new Set(notification.match(ValidationHandler.emailRegex))] ||
      [];
    console.log({ studentEmails });
    const result = await studentService.getStudentNotificationList(
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

export const StudentController = {
  register,
  suspend,
  getNotificationList,
  getCommonStudents,
};
