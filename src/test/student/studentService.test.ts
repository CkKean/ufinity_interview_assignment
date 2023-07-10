import { Model, ModelStatic } from 'sequelize-typescript';
import { TeacherStudentRelationship } from '../../models/teacherStudentRelationshipModel';
import { StudentService } from '../../services/studentService';

jest.mock('../../config/database', () => ({
  transaction: jest.fn().mockImplementation((transactionCallback) => {
    return {
      ...transactionCallback,
      commit: jest.fn(() => Promise.resolve()),
      rollback: jest.fn(() => Promise.resolve()),
      get: jest.fn(() => Promise.resolve()),
      save: jest.fn(() => Promise.resolve()),
    };
  }),
  commit: jest.fn(() => Promise.resolve()),
  rollback: jest.fn(() => Promise.resolve()),
  save: jest.fn(() => Promise.resolve()),
}));

jest.mock('../../models/studentModel');
jest.mock('../../models/teacherModel');
jest.mock('../../models/teacherStudentRelationshipModel', () => {
  const mockTeacherStudentRelationship = jest
    .fn<Partial<ModelStatic<Model<TeacherStudentRelationship>>>, any>()
    .mockImplementation(() => {
      return {
        update: jest.fn(),
        upsert: jest
          .fn()
          .mockReturnValue([
            { student_id: 1, student_email: 'student1@gmail.com' },
            true,
          ]),
        findAll: jest
          .fn()
          .mockReturnValue([
            { student_email: 'student1@gmail.com' },
            { student_email: 'student2@gmail.com' },
          ]),
      };
    });

  return { TeacherStudentRelationship: mockTeacherStudentRelationship() };
});

describe('Test register service function', () => {
  test('Should return emails', async () => {
    // const students = ['student1@gmail.com'];
    // const teacherId = 1;
    // const studentBuilt = Student.build();
    // // Spy on the save method of the mock instance
    // jest
    //   .spyOn(Student, 'findOrCreate')
    //   .mockResolvedValueOnce([
    //     { student_id: 1, student_email: 'student1@gmail.com' },
    //     true,
    //   ] as [Student, boolean]);
    // const saveMock = jest.spyOn(Student).mockResolvedValueOnce(1 as any);
    // const mockStudentService = new StudentService();
    // const result = await mockStudentService.register({ students, teacherId });
    // expect(result).toBe('lol');
  });
});

describe('Test getCommonStudent service function', () => {
  test('Should return common student emails of a teacher.', async () => {
    const teacher = ['teacherken@gmail.com'];
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
  // test('Should return "Suspend student successfully" message if suspend successfully', async () => {
  //   const studentEmail = 'student1@gmail.com';
  //   jest.spyOn(Student, 'findOne').mockResolvedValueOnce({
  //     student_id: 1,
  //     student_email: 'student1@gmail.com',
  //     student_status: 1,
  //     student_created_at: new Date(),
  //     student_updated_at: new Date(),
  //   } as Student);
  //   const userModelInstanceMock = { save: jest.fn() };
  //   const userModelMock = {
  //     findByPk: jest.fn().mockResolvedValueOnce(userModelInstanceMock),
  //   };
  //   jest.spyOn(TeacherStudentRelationship, 'update').mockResolvedValueOnce([1]);
  //   const mockStudentService = new StudentService();
  //   const result = await mockStudentService.suspend(studentEmail);
  //   expect(result).toBe('lol');
  // });
});

describe('Test getNotificationList service function', () => {
  test('Should return registered student emails only', async () => {
    const studentEmails: string[] = [];
    const teacherId = 1;

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
