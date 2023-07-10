import sequelize from '../../config/database';
import ErrorBase from '../../errors/ErrorBase';
import { Student } from '../../models/studentModel';
import { TeacherStudentRelationship } from '../../models/teacherStudentRelationshipModel';
import { StudentService } from '../../services/studentService';
import { StatusCodes } from 'http-status-codes';
import { Transaction, TransactionOptions } from 'sequelize';

const originaStudentModel = jest.requireActual('../../models/studentModel');
const originaTeacherStudentRelationshipModel = jest.requireActual(
  '../../models/teacherStudentRelationshipModel'
);

jest.mock('../../config/database');
jest.mock('../../models/studentModel');
jest.mock('../../models/teacherModel');
jest.mock('../../models/teacherStudentRelationshipModel');

let rollback: jest.Mock;
let commit: jest.Mock;
let transaction: jest.SpyInstance<
  Promise<Transaction>,
  [options?: TransactionOptions]
>;

beforeEach(() => {
  rollback = jest.fn(() => Promise.resolve());
  commit = jest.fn(() => Promise.resolve());

  transaction = jest
    .spyOn(sequelize, 'transaction')
    .mockImplementation((transactionCallback: any) => {
      return {
        ...transactionCallback,
        commit: commit,
        rollback: rollback,
      };
    });
});

afterEach(() => {
  jest.resetAllMocks();
});

describe('Test register service function', () => {
  test('Should return "Register student successfully." message if register student successfully', async () => {
    const students = ['student1@gmail.com', 'student2@gmail.com'];
    const teacherId = 1;

    const findOneOrCreateData = [
      { student_id: 1, student_email: 'student1@gmail.com', student_status: 1 },
      { student_id: 2, student_email: 'student2@gmail.com', student_status: 1 },
    ];

    const findOneOrCreate = jest
      .spyOn(Student, 'findOrCreate')
      .mockResolvedValueOnce([
        {
          ...findOneOrCreateData[0],
          ...originaStudentModel,
          get: jest.fn(() =>
            Promise.resolve(findOneOrCreateData[0].student_id)
          ),
        },
        true,
      ])
      .mockResolvedValueOnce([
        {
          ...findOneOrCreateData[1],
          ...originaStudentModel,
          get: jest.fn(() =>
            Promise.resolve(findOneOrCreateData[1].student_id)
          ),
        },
        true,
      ]);

    const upsert = jest
      .spyOn(TeacherStudentRelationship, 'upsert')
      .mockResolvedValueOnce([
        {
          student_id: 1,
          teacher_id: teacherId,
          teacher_student_relationship_id: 1,
          teacher_student_relationship_status: 1,
          ...originaTeacherStudentRelationshipModel,
        },
        true,
      ])
      .mockResolvedValueOnce([
        {
          student_id: 2,
          teacher_id: teacherId,
          teacher_student_relationship_id: 1,
          teacher_student_relationship_status: 1,
          ...originaTeacherStudentRelationshipModel,
        },
        true,
      ]);

    const mockStudentService = new StudentService();
    const result = await mockStudentService.register({ students, teacherId });

    expect(findOneOrCreate).toHaveBeenCalledTimes(students.length);
    expect(upsert).toHaveBeenCalledTimes(students.length);
    expect(transaction).toHaveBeenCalledTimes(1);
    expect(commit).toHaveBeenCalledTimes(1);
    expect(rollback).toHaveBeenCalledTimes(0);
    expect(result).toEqual({
      status: true,
      message: 'Register student successfully.',
    });
  });

  test('Should return "Register student successfully." message if register zero student.', async () => {
    const students: string[] = [];
    const teacherId = 1;

    const findOneOrCreate = jest
      .spyOn(Student, 'findOrCreate')
      .mockResolvedValueOnce(null);

    const upsert = jest
      .spyOn(TeacherStudentRelationship, 'upsert')
      .mockResolvedValueOnce(null);

    const mockStudentService = new StudentService();
    const result = await mockStudentService.register({ students, teacherId });

    expect(findOneOrCreate).toHaveBeenCalledTimes(students.length);
    expect(upsert).toHaveBeenCalledTimes(students.length);
    expect(transaction).toHaveBeenCalledTimes(1);
    expect(commit).toHaveBeenCalledTimes(1);
    expect(rollback).toHaveBeenCalledTimes(0);
    expect(result).toEqual({
      status: true,
      message: 'Register student successfully.',
    });
  });

  test('Should return "Internal server error" message if internal server error occurs.', async () => {
    const students = ['student1@gmail.com'];
    const teacherId = 1;

    const error = new Error('Internal server error');
    const findOneOrCreate = jest
      .spyOn(Student, 'findOrCreate')
      .mockRejectedValue(error);

    const upsert = jest
      .spyOn(TeacherStudentRelationship, 'upsert')
      .mockResolvedValueOnce([
        {
          student_id: 1,
          teacher_id: teacherId,
          teacher_student_relationship_id: 1,
          teacher_student_relationship_status: 1,
          ...originaTeacherStudentRelationshipModel,
        },
        true,
      ])
      .mockResolvedValueOnce([
        {
          student_id: 2,
          teacher_id: teacherId,
          teacher_student_relationship_id: 1,
          teacher_student_relationship_status: 1,
          ...originaTeacherStudentRelationshipModel,
        },
        true,
      ]);

    const mockStudentService = new StudentService();
    const result = await mockStudentService.register({ students, teacherId });

    expect(findOneOrCreate).toHaveBeenCalledTimes(1);
    expect(upsert).toHaveBeenCalledTimes(0);
    expect(transaction).toHaveBeenCalledTimes(1);
    expect(commit).toHaveBeenCalledTimes(0);
    expect(rollback).toHaveBeenCalledTimes(1);
    expect(result).toEqual({
      status: false,
      error: error,
    });
  });
});

describe('Test getCommonStudent service function', () => {
  test('Should return common student emails of a teacher.', async () => {
    const teacher = ['teacherken@gmail.com'];

    const data = [
      { student_email: 'student1@gmail.com' },
      { student_email: 'student2@gmail.com' },
    ];
    jest
      .spyOn(TeacherStudentRelationship, 'findAll')
      .mockResolvedValueOnce(
        data as Array<TeacherStudentRelationship & { student_email?: string }>
      );

    const mockStudentService = new StudentService();
    const result = await mockStudentService.getCommonStudent(teacher);
    expect(result).toEqual({
      data: expect.arrayContaining([
        'student1@gmail.com',
        'student2@gmail.com',
      ]),
      status: true,
      message: 'Retrieve common student successfully.',
    });
  });

  test('Should return common student emails of a list of teacher.', async () => {
    const teacher = ['teacherkang@gmail.com', 'teacherping@gmail.com'];
    const data = [
      { student_email: 'student1@gmail.com' },
      { student_email: 'student2@gmail.com' },
      { student_email: 'student3@gmail.com' },
      { student_email: 'student4@gmail.com' },
    ];
    jest
      .spyOn(TeacherStudentRelationship, 'findAll')
      .mockResolvedValueOnce(
        data as Array<TeacherStudentRelationship & { student_email?: string }>
      );
    const mockStudentService = new StudentService();
    const result = await mockStudentService.getCommonStudent(teacher);
    expect(result).toEqual({
      data: expect.arrayContaining([
        'student1@gmail.com',
        'student2@gmail.com',
        'student3@gmail.com',
        'student4@gmail.com',
      ]),
      status: true,
      message: 'Retrieve common student successfully.',
    });
  });

  test('Should return zero student emails.', async () => {
    const teacher = ['teacherkang@gmail.com'];
    jest.spyOn(TeacherStudentRelationship, 'findAll').mockResolvedValueOnce([]);
    const mockStudentService = new StudentService();
    const result = await mockStudentService.getCommonStudent(teacher);
    expect(result).toEqual({
      data: [],
      status: true,
      message: 'Retrieve common student successfully.',
    });
  });

  test('Should return error message "Internal server error" if occurs errors', async () => {
    const teacher = ['teacherken@gmail.com'];
    const error = new Error('Internal server error');
    jest
      .spyOn(TeacherStudentRelationship, 'findAll')
      .mockRejectedValueOnce(error);
    const mockStudentService = new StudentService();
    const result = await mockStudentService.getCommonStudent(teacher);
    expect(result).toEqual({
      status: false,
      error,
    });
  });
});

describe('Test suspend service function', () => {
  test('Should return "Suspend student successfully." message if suspend student successfully', async () => {
    const studentEmail = 'student1@gmail.com';
    const findOne = jest.spyOn(Student, 'findOne').mockResolvedValueOnce({
      student_id: 1,
      student_email: 'student1@gmail.com',
      student_status: 1,
      ...originaStudentModel,
      save: jest.fn(() => Promise.resolve([1])),
    } as Student);

    const update = jest
      .spyOn(TeacherStudentRelationship, 'update')
      .mockResolvedValueOnce([1]);

    const mockStudentService = new StudentService();

    const result = await mockStudentService.suspend(studentEmail);

    expect(findOne).toHaveBeenCalledTimes(1);
    expect(update).toHaveBeenCalledTimes(1);
    expect(transaction).toHaveBeenCalledTimes(1);
    expect(commit).toHaveBeenCalledTimes(1);
    expect(rollback).toHaveBeenCalledTimes(0);
    expect(result).toEqual({
      status: true,
      message: 'Suspend student successfully.',
    });
  });

  test('Should return error if student does not exist.', async () => {
    const studentEmail = 'student1@gmail.com';
    const findOne = jest
      .spyOn(Student, 'findOne')
      .mockResolvedValueOnce(null as Student);
    const update = jest
      .spyOn(TeacherStudentRelationship, 'update')
      .mockResolvedValueOnce([1]);
    const mockStudentService = new StudentService();
    const result = await mockStudentService.suspend(studentEmail);
    expect(findOne).toHaveBeenCalledTimes(1);
    expect(update).toHaveBeenCalledTimes(0);
    expect(transaction).toHaveBeenCalledTimes(1);
    expect(commit).toHaveBeenCalledTimes(0);
    expect(rollback).toHaveBeenCalledTimes(1);
    expect(result).toEqual({
      status: false,
      error: new ErrorBase('Student does not exist.', StatusCodes.OK),
    });
  });

  test('Should return error if student was in suspended status.', async () => {
    const studentEmail = 'student1@gmail.com';
    const findOne = jest.spyOn(Student, 'findOne').mockResolvedValueOnce({
      student_id: 1,
      student_email: 'student1@gmail.com',
      student_status: 2,
      ...originaStudentModel,
      save: jest.fn(() => Promise.resolve([1])),
    } as Student);
    const update = jest
      .spyOn(TeacherStudentRelationship, 'update')
      .mockResolvedValueOnce([1]);
    const mockStudentService = new StudentService();
    const result = await mockStudentService.suspend(studentEmail);
    expect(findOne).toHaveBeenCalledTimes(1);
    expect(update).toHaveBeenCalledTimes(0);
    expect(transaction).toHaveBeenCalledTimes(1);
    expect(commit).toHaveBeenCalledTimes(0);
    expect(rollback).toHaveBeenCalledTimes(1);
    expect(result).toEqual({
      status: false,
      error: new ErrorBase('Student was in suspended status.', StatusCodes.OK),
    });
  });

  test('Should return error message "Internal server error" if occurs errors', async () => {
    const studentEmail = 'student1@gmail.com';

    const error = new Error('Internal server error');
    const findOne = jest.spyOn(Student, 'findOne').mockRejectedValueOnce(error);

    const update = jest
      .spyOn(TeacherStudentRelationship, 'update')
      .mockResolvedValueOnce([1]);

    const mockStudentService = new StudentService();

    const result = await mockStudentService.suspend(studentEmail);

    expect(findOne).toHaveBeenCalledTimes(1);
    expect(update).toHaveBeenCalledTimes(0);
    expect(transaction).toHaveBeenCalledTimes(1);
    expect(commit).toHaveBeenCalledTimes(0);
    expect(rollback).toHaveBeenCalledTimes(1);
    expect(result).toEqual({
      status: false,
      error: error,
    });
  });
});

describe('Test getNotificationList service function', () => {
  test('Should return registered student emails only', async () => {
    const studentEmails: string[] = [];
    const teacherId = 1;
    jest
      .spyOn(TeacherStudentRelationship, 'findAll')
      .mockResolvedValueOnce([
        { student_email: 'student1@gmail.com' },
        { student_email: 'student2@gmail.com' },
      ] as Array<TeacherStudentRelationship & { student_email?: string }>);
    const mockStudentService = new StudentService();
    const result = await mockStudentService.getStudentNotificationList(
      teacherId,
      studentEmails
    );
    expect(result).toEqual({
      data: expect.arrayContaining([
        'student1@gmail.com',
        'student2@gmail.com',
      ]),
      status: true,
      message: 'Retrieve student notification email successfully.',
    });
  });

  test('Should return registered emails and notification emails', async () => {
    const studentEmails = ['student3@gmail.com'];
    const teacherId = 1;
    jest
      .spyOn(TeacherStudentRelationship, 'findAll')
      .mockResolvedValueOnce([
        { student_email: 'student1@gmail.com' },
        { student_email: 'student2@gmail.com' },
      ] as Array<TeacherStudentRelationship & { student_email?: string }>);
    const mockStudentService = new StudentService();
    const result = await mockStudentService.getStudentNotificationList(
      teacherId,
      studentEmails
    );
    expect(result).toEqual({
      data: expect.arrayContaining([
        'student1@gmail.com',
        'student2@gmail.com',
        'student3@gmail.com',
      ]),
      status: true,
      message: 'Retrieve student notification email successfully.',
    });
  });

  test('Should return zero emails', async () => {
    const studentEmails: string[] = [];
    const teacherId = 1;
    jest.spyOn(TeacherStudentRelationship, 'findAll').mockResolvedValueOnce([]);
    const mockStudentService = new StudentService();
    const result = await mockStudentService.getStudentNotificationList(
      teacherId,
      studentEmails
    );
    expect(result).toEqual({
      data: [],
      status: true,
      message: 'Retrieve student notification email successfully.',
    });
  });

  test('Should return error message "Internal server error" if occurs errors', async () => {
    const studentEmails: string[] = [];
    const teacherId = 1;
    const error = new Error('Internal server error');
    jest
      .spyOn(TeacherStudentRelationship, 'findAll')
      .mockRejectedValueOnce(error);
    const mockStudentService = new StudentService();
    const result = await mockStudentService.getStudentNotificationList(
      teacherId,
      studentEmails
    );
    expect(result).toEqual({
      status: false,
      error,
    });
  });
});
