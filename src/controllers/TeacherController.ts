import { NextFunction, RequestHandler } from 'express';
import { matchedData } from 'express-validator';
import { StatusCodes } from 'http-status-codes';
import { TeacherCreateModel } from '../models/teacherModel';
import { TeacherService } from '../services/teacherService';

export class TeacherController {
  teacherService = new TeacherService();

  create: RequestHandler = async (req, res, next: NextFunction) => {
    try {
      const { teacher_email } = matchedData(req) as TeacherCreateModel;

      const result = await this.teacherService.create({ teacher_email });

      if (!result.status) {
        throw result.error;
      }

      res.sendStatus(StatusCodes.OK);
    } catch (error) {
      next(error);
    }
  };
}
