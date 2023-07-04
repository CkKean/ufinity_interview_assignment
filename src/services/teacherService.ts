import { CustomError } from "../errors/CustomError";
import { Teacher } from "../models/teacherModel";
import ValidationHandler from "../utils/validationHandler";

export class TeacherService {
  getByEmail = async (email: string) => {
    try {
      if (!ValidationHandler.isValidEmailFormat(email)) {
        throw new CustomError("Invalid teacher email");
      }

      const teacher = await Teacher.findOne({
        where: {
          teacher_email: email,
        },
        attributes: ["teacher_id"],
        raw: true,
      });

      if (!teacher) {
        return {
          status: false,
          message: "Teacher does not exist.",
        };
      }

      return {
        status: true,
        data: teacher,
        message: "Retrieve teacher successfully.",
      };
    } catch (error) {
      return {
        status: false,
        message:
          error instanceof CustomError
            ? error.message
            : "Retrieve teacher unsuccessfully.",
      };
    }
  };
}
