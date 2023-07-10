import sequelize from '../config/database';
import Logger from '../config/logger';
import { STUDENT_STATUS } from '../const/studentStatus';
import { TEACHER_STATUS } from '../const/teacherStatus';
import { TEACHER_STUDENT_RELATIONSHIP_STATUS } from '../const/teacherStudentRelationshipStatus';
import ErrorBase from '../errors/ErrorBase';
import { Student } from '../models/studentModel';
import { Teacher } from '../models/teacherModel';
import {
  TeacherStudentRelationship,
  TeacherStudentRelationshipModel,
} from '../models/teacherStudentRelationshipModel';
import { StatusCodes } from 'http-status-codes';
import { Op } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';

const LOG = new Logger('studentService.ts');

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
      if (students.length > 0) {
        await Promise.all(
          students.map(async (email: string) => {
            const [student] = await Student.findOrCreate({
              where: {
                student_email: email,
              },
              transaction: t,
            });

            const studentId = student.get('student_id');

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
      }
      await t.commit();

      return {
        status: true,
        message: 'Register student successfully.',
      };
    } catch (error) {
      await t.rollback();
      LOG.error(error);
      return { status: false, error };
    }
  };

  getCommonStudent = async (teacher: string[]) => {
    try {
      const students = await TeacherStudentRelationship.findAll({
        include: [
          {
            model: Teacher,
            where: {
              teacher_email: {
                [Op.in]: teacher,
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
        attributes: [[Sequelize.col('student.student_email'), 'student_email']],
        raw: true,
      });

      const common: { [email: string]: number } = {};
      students.forEach(
        ({
          student_email,
        }: TeacherStudentRelationshipModel & {
          student_email?: string;
        }) => {
          if (common[student_email] !== undefined) {
            common[student_email] = common[student_email] + 1; 
          } else {
            common[student_email] = 1;
          }
        }
      );

      const data: string[] = [];
      for (const [key, val] of Object.entries(common)) {
        if (val > 0 && val === teacher.length) {
          data.push(key);
        }
      }

      return {
        status: true,
        data: data,
        message: 'Retrieve common student successfully.',
      };
    } catch (error) {
      LOG.error(error);
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
        },
      });

      if (!student) {
        throw new ErrorBase('Student does not exist.', StatusCodes.OK);
      }

      if (student.student_status === STUDENT_STATUS.SUSPENDED) {
        throw new ErrorBase('Student was in suspended status.', StatusCodes.OK);
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
        message: 'Suspend student successfully.',
      };
    } catch (error) {
      await t.rollback();
      LOG.error(error);
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
        },
        include: [
          {
            model: Student,
            attributes: [],
          },
        ],
        attributes: [
          [Sequelize.col('student.student_email'), 'student_email'],
          [Sequelize.col('student.student_status'), 'student_status'],
        ],
        raw: true,
      });

      const studentEmailSet = new Set(studentEmails);
      const registeredEmails: string[] = [];

      registeredStudents.forEach(
        ({
          student_email,
          student_status,
        }: Partial<TeacherStudentRelationship> & {
          student_email?: string;
          student_status?: number;
        }) => {
          if (studentEmailSet.has(student_email)) {
            if (student_status === STUDENT_STATUS.ACTIVE) {
              registeredEmails.push(student_email);
            } else {
              studentEmailSet.delete(student_email);
            }
          } else if (student_status === STUDENT_STATUS.ACTIVE) {
            registeredEmails.push(student_email);
          }
        }
      );

      const data = [...studentEmailSet].concat(registeredEmails);

      return {
        status: true,
        data: data,
        message: 'Retrieve student notification email successfully.',
      };
    } catch (error) {
      LOG.error(error);
      return {
        status: false,
        error,
      };
    }
  };
}
