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
  public async register({
    students,
    teacherId,
  }: {
    students: string[];
    teacherId: number;
  }) {
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
  }

  public async getCommonStudent(teacher: string[]) {
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
        group: ['student.student_email'],
        having: Sequelize.literal(
          `COUNT(student.student_email) = ${teacher.length}`
        ),
        raw: true,
      });

      const data: string[] = students.map(
        (
          student: TeacherStudentRelationshipModel & {
            student_email?: string;
          }
        ) => student.student_email
      );

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
  }

  public async suspend(studentEmail: string) {
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
  }

  public async getStudentNotificationList(
    teacherId: number,
    studentEmails: string[]
  ) {
    try {
      const existedStudentsPromise = Student.findAll({
        where: {
          student_email: {
            [Op.in]: studentEmails,
          },
          student_status: STUDENT_STATUS.ACTIVE,
        },
        attributes: ['student_email'],
        raw: true,
      });

      const registeredStudentsPromise = TeacherStudentRelationship.findAll({
        where: {
          teacher_id: teacherId,
        },
        include: [
          {
            model: Student,
            where: {
              student_email: { [Op.notIn]: studentEmails },
              student_status: STUDENT_STATUS.ACTIVE,
            },
            attributes: [],
          },
        ],
        attributes: [[Sequelize.col('student.student_email'), 'student_email']],
        raw: true,
      });

      const [existedStudents, registeredStudents] = await Promise.all([
        existedStudentsPromise,
        registeredStudentsPromise,
      ]);

      const existedStudentEmails: string[] = existedStudents.map(
        (student) => student.student_email
      );
      const registeredStudentEmails: string[] = registeredStudents.map(
        (
          student: Partial<TeacherStudentRelationship> & {
            student_email?: string;
          }
        ) => student.student_email
      );

      const data = existedStudentEmails.concat(registeredStudentEmails);

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
  }
}
