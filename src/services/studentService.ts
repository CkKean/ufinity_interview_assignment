import { Op, Sequelize } from "sequelize";
import sequelize from "../config/database";
import { STUDENT_STATUS, Student } from "../models/studentModel";
import { TEACHER_STATUS, Teacher } from "../models/teacherModel";
import {
  TEACHER_STUDENT_RELATIONSHIP_STATUS,
  TeacherStudentRelationship,
  TeacherStudentRelationshipModel,
} from "../models/teacherStudentRelationshipModel";

export class StudentService {
  register = async ({
    students,
    teacherId,
  }: {
    students: string[];
    teacherId: number;
  }) => {
    const t = await sequelize.transaction();
    try {
      await Promise.all(
        students.map(async (email: string) => {
          const [student] = await Student.findOrCreate({
            where: {
              student_email: email,
            },
            transaction: t,
          });

          const studentId = student.get("student_id");

          await TeacherStudentRelationship.upsert(
            {
              student_id: studentId,
              teacher_id: teacherId,
              teacher_student_relationship_updated_at: new Date(),
            },
            { transaction: t }
          );
        })
      );

      await t.commit();
      return {
        status: true,
        message: "Register student successfully.",
      };
    } catch (error) {
      await t.rollback();
      console.log(error);
      return { status: false, error };
    }
  };

  getCommonStudent = async (teacher: string[] | string) => {
    try {
      const students = await TeacherStudentRelationship.findAll({
        include: [
          {
            model: Teacher,
            where: {
              teacher_email: {
                [Op.in]: Array.isArray(teacher) ? teacher : [teacher],
              },
              teacher_status: TEACHER_STATUS.ACTIVE,
            },
            attributes: [],
          },
          {
            model: Student,
            attributes: [],
          },
        ],
        attributes: [[Sequelize.col("student.student_email"), "student_email"]],
        group: ["student.student_email"],
      });

      return {
        status: true,
        data: students,
        message: "Retrieve common student successfully.",
      };
    } catch (error) {
      console.log(error);
      return {
        status: false,
        error,
      };
    }
  };

  suspend = async (studentEmail: string) => {
    const t = await sequelize.transaction();
    try {
      const student = await Student.findOne({
        where: {
          student_email: studentEmail,
          student_status: {
            [Op.ne]: STUDENT_STATUS.SUSPENDED,
          },
        },
      });

      if (!student) {
        return {
          status: true,
          message: "Suspend student successfully",
        };
      }

      const currentDateTime = new Date();
      student.student_status = STUDENT_STATUS.SUSPENDED;
      student.student_suspended_at = currentDateTime;
      student.student_updated_at = currentDateTime;
      await student.save({ transaction: t });

      await TeacherStudentRelationship.update(
        {
          teacher_student_relationship_status:
            TEACHER_STUDENT_RELATIONSHIP_STATUS.INACTIVE,
        },
        {
          where: {
            student_id: student.student_id,
          },
          transaction: t,
        }
      );

      await t.commit();

      return {
        status: true,
        message: "Suspend student successfully",
      };
    } catch (error) {
      await t.rollback();
      console.log(error);
      return {
        status: false,
        error,
      };
    }
  };

  getStudentNotificationList = async (
    teacherId: number,
    studentEmails: string[]
  ) => {
    try {
      const registeredStudents = await TeacherStudentRelationship.findAll({
        where: {
          teacher_id: teacherId,
          teacher_student_relationship_status:
            TEACHER_STUDENT_RELATIONSHIP_STATUS.ACTIVE,
        },
        include: [
          {
            model: Student,
            where: {
              student_status: STUDENT_STATUS.ACTIVE,
              student_email: {
                [Op.notIn]: studentEmails,
              },
            },
            attributes: [],
          },
        ],
        attributes: [[Sequelize.col("student.student_email"), "student_email"]],
        raw: true,
      });

      const data = [
        ...studentEmails,
        ...registeredStudents.map(
          (
            student: TeacherStudentRelationshipModel & {
              student_email?: string;
            }
          ) => student.student_email
        ),
      ];

      return {
        status: true,
        data: data,
        message: "Retrieve student common successfully",
      };
    } catch (error) {
      console.log(error);
      return {
        status: false,
        error,
      };
    }
  };
}
