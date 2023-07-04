import { NextFunction, RequestHandler } from "express";
import { matchedData } from "express-validator";
import { StatusCodes } from "http-status-codes";
import { TeacherCreateModel } from "../models/teacherModel";
import { TeacherService } from "../services/teacherService";

const teacherService = new TeacherService();

const create: RequestHandler = async (req, res, next: NextFunction) => {
  try {
    const { teacher_email } = matchedData(req) as TeacherCreateModel;

    const result = await teacherService.create({ teacher_email });

    if (!result.status) {
      throw result.error;
    }

    return res.sendStatus(StatusCodes.OK);
  } catch (error) {
    next(error);
  }
};

export const TeacherController = {
  create,
};
