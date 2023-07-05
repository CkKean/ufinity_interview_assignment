import { StatusCodes } from 'http-status-codes';
import ErrorBase from '../errors/ErrorBase';
import { Teacher, TeacherCreateModel } from '../models/teacherModel';
import ValidationHandler from '../utils/validationHandler';

export class TeacherService {
  create = async ({ teacher_email }: TeacherCreateModel) => {
    try {
      const [teacher, created] = await Teacher.findOrCreate({
        where: {
          teacher_email: teacher_email,
        },
      });

      if (!created) {
        throw new ErrorBase('Teacher is existed.', StatusCodes.OK);
      }

      return {
        status: true,
        message: 'Create teacher successfully',
      };
    } catch (error) {
      console.log(error);
      return { status: false, error };
    }
  };

  getByEmail = async (email: string) => {
    try {
      if (!ValidationHandler.isValidEmailFormat(email)) {
        throw new ErrorBase('Invalid teacher email1.', StatusCodes.BAD_REQUEST);
      }

      const teacher = await Teacher.findOne({
        where: {
          teacher_email: email,
        },
        attributes: ['teacher_id'],
        raw: true,
      });

      if (!teacher) {
        throw new ErrorBase('Teacher does not exist.', StatusCodes.OK);
      }

      return {
        status: true,
        data: teacher,
        message: 'Retrieve teacher successfully.',
      };
    } catch (error) {
      console.log(error);
      return { status: false, error };
    }
  };
}
