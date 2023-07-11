import Logger from '../config/logger';
import { NextFunction, Request, RequestHandler, Response } from 'express';
import { matchedData } from 'express-validator';
import { StatusCodes } from 'http-status-codes';
import { TeacherCreateModel } from '../models/teacherModel';
import { TeacherService } from '../services/teacherService';

const LOG = new Logger('teacherController.ts');

const teacherService = new TeacherService();

const create: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { teacher_email } = matchedData(req) as TeacherCreateModel;

    const result = await teacherService.create({ teacher_email });

    if (!result.status) {
      throw result.error;
    }

    res.sendStatus(StatusCodes.OK);
  } catch (error) {
    LOG.error(error);
    next(error);
  }
};

export const TeacherController = {
  create,
};
