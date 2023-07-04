import { CustomError } from "../errors/CustomError";
import { Student } from "../models/studentModel";
import {
    TeacherStudentRelationship
} from "../models/teacherStudentRelationshipModel";
import ValidationHandler from "../utils/validationHandler";

export class StudentService {
  register = async ({
    students,
    teacherId,
  }: {
    students: string[];
    teacherId: number;
  }) => {
    try {
      if (students.length <= 0) {
        throw new CustomError("Student email is required");
      }

      if (!ValidationHandler.isValidNumber(teacherId)) {
        throw new CustomError("Teacher is required");
      }

      await Promise.all(
        students.map(async (email: string) => {
          const newStudent = await Student.create({
            student_email: email,
          });

          newStudent.student_id;

          await TeacherStudentRelationship.upsert({
            student_id: newStudent.student_id,
            teacher_id: teacherId,
          });
        })
      );
      return {
        status: true,
        message: "Register student successfully.",
      };
    } catch (error) {
      console.log(error);
      return {
        status: false,
        message:
          error instanceof CustomError
            ? error.message
            : "Register student unsuccessfully.",
      };
    }
  };
}
