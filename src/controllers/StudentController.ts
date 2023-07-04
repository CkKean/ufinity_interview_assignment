import Express, { NextFunction, RequestHandler } from "express";
import { matchedData, validationResult } from "express-validator";
import { StatusCodes } from "http-status-codes";
import { Op } from "sequelize";
import { Sequelize } from "sequelize-typescript";
import {
  Student,
  StudentRegisterRequest
} from "../models/studentModel";
import { Teacher } from "../models/teacherModel";
import {
  TeacherStudentRelationship
} from "../models/teacherStudentRelationshipModel";
import { studentRule } from "../rules/studentRule";
import { StudentService } from "../services/studentService";
import { TeacherService } from "../services/teacherService";

const StudentController = Express.Router();
const teacherService = new TeacherService();
const studentService = new StudentService();

const register: RequestHandler = async (req, res, next: NextFunction) => {
  try {
    const errors = validationResult(req).array()[0];
    if (errors) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: false,
        message: errors.msg,
      });
    }

    const { students, teacher } = matchedData(req) as StudentRegisterRequest;

    const teacherData = await teacherService.getByEmail(teacher);
    if (!teacherData.status) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: false,
        message: "Teacher does not exist.",
      });
    }

    const registerStudent = await studentService.register({
      students,
      teacherId: teacherData.data.teacher_id,
    });

    if (!registerStudent.status) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: false,
        message: "Teacher does not exist.",
      });
    }

    return res.status(StatusCodes.OK).json({
      status: true,
      message: "Register student(s) successfully.",
    });
  } catch (error) {
    next(error);
  }
};

const commonStudents: RequestHandler = async (req, res, next: NextFunction) => {
  try {
    const errors = validationResult(req).array()[0];
    if (errors) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: false,
        message: errors.msg,
      });
    }

    const { teacher } = matchedData(req);

    const students = await Teacher.findAll({
      where: {
        teacher_email: {
          [Op.in]: Array.isArray(teacher) ? teacher : [teacher],
        },
      },
      include: [
        {
          model: TeacherStudentRelationship,
          include: [
            {
              model: Student,
            },
          ],
        },
      ],
      attributes: [
        [
          Sequelize.literal(
            "DISTINCT `TeacherStudentRelationship->student`.`student_email`"
          ),
          "unique_student_email",
        ],
      ],
    });

    return res.status(StatusCodes.OK).json({
      students: students,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const suspend: RequestHandler = async (req, res, next: NextFunction) => {
  try {
  } catch (error) {
    next(error);
  }
};

const retrieveNotifications: RequestHandler = async (
  req,
  res,
  next: NextFunction
) => {
  try {
  } catch (error) {
    next(error);
  }
};

StudentController.post("/register", studentRule.forRegister, register);
StudentController.get(
  "/commonstudents",
  studentRule.forCommonStudents,
  commonStudents
);
StudentController.get("/suspend", studentRule.forSuspend, suspend);
StudentController.get(
  "/retrievefornotifications",
  studentRule.forRetrieveNotifications,
  retrieveNotifications
);

export default StudentController;
