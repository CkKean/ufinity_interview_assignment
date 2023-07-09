import { Model, ModelStatic } from 'sequelize-typescript';
import { TeacherStudentRelationship } from '../models/teacherStudentRelationshipModel';
import { StudentService } from '../services/studentService';

jest.mock('../models/studentModel');
jest.mock('../models/teacherModel');
jest.mock('../models/teacherStudentRelationshipModel', () => {
  const mockTeacherStudentRelationship = jest
    .fn<Partial<ModelStatic<Model<TeacherStudentRelationship>>>, any>()
    .mockImplementation(() => {
      return {
        upsert: jest
          .fn()
          .mockReturnValue([
            { student_id: 1, student_email: 'commonstudent3@gmail.com' },
            true,
          ]),
        findAll: jest
          .fn()
          .mockReturnValue([
            { student_email: 'commonstudent3@gmail.com' },
            { student_email: 'commonstudent4@gmail.com' },
          ]),
      };
    });

  return { TeacherStudentRelationship: mockTeacherStudentRelationship() };
});

// describe('Test register service function', () => {
//   test('Should return emails', async () => {
//     const studentEmails = ['student3@gmail.com'];
//     const teacherId = 1;

//     mockFindAll.mockReturnValueOnce([{ student_email: 'student1@gmail.com' }]);

//     // const mockRelationship = jest
//     //   .fn<Partial<ModelStatic<Model<TeacherStudentRelationship>>>, any>()
//     //   .mockImplementation(() => {
//     //     return {
//     //       findAll: jest
//     //         .fn()
//     //         .mockReturnValue([{ student_email: 'student1@gmail.com' }]),
//     //     };
//     //   });

//     const mockStudentService = new StudentService();
//     const result = await mockStudentService.getStudentNotificationList(
//       teacherId,
//       studentEmails
//     );

//     expect(result).toBe('lol');
//   });
// });

// describe('Test getCommonStudent service function', () => {
//   test('Should return emails', async () => {
//     const studentEmails = ['student3@gmail.com'];
//     const teacherId = 1;

//     mockFindAll.mockReturnValueOnce([{ student_email: 'student1@gmail.com' }]);

//     // const mockRelationship = jest
//     //   .fn<Partial<ModelStatic<Model<TeacherStudentRelationship>>>, any>()
//     //   .mockImplementation(() => {
//     //     return {
//     //       findAll: jest
//     //         .fn()
//     //         .mockReturnValue([{ student_email: 'student1@gmail.com' }]),
//     //     };
//     //   });

//     const mockStudentService = new StudentService();
//     const result = await mockStudentService.getStudentNotificationList(
//       teacherId,
//       studentEmails
//     );

//     expect(result).toBe('lol');
//   });
// });

// describe('Test suspend service function', () => {
//   test('Should return emails', async () => {
//     const studentEmails = ['student3@gmail.com'];
//     const teacherId = 1;

//     mockFindAll.mockReturnValueOnce([{ student_email: 'student1@gmail.com' }]);

//     // const mockRelationship = jest
//     //   .fn<Partial<ModelStatic<Model<TeacherStudentRelationship>>>, any>()
//     //   .mockImplementation(() => {
//     //     return {
//     //       findAll: jest
//     //         .fn()
//     //         .mockReturnValue([{ student_email: 'student1@gmail.com' }]),
//     //     };
//     //   });

//     const mockStudentService = new StudentService();
//     const result = await mockStudentService.getStudentNotificationList(
//       teacherId,
//       studentEmails
//     );

//     expect(result).toBe('lol');
//   });
// });

describe('Test getNotificationList service function', () => {
  test('Should return registered emails only', async () => {
    const studentEmails = ['student3@gmail.com'];
    const teacherId = 1;

    const mockStudentService = new StudentService();
    const result = await mockStudentService.getStudentNotificationList(
      teacherId,
      studentEmails
    );

    expect(result).toBe('lol');
  });

  //   test('Should return registered emails and notification emails', async () => {
  //     const studentEmails = ['student3@gmail.com'];
  //     const teacherId = 1;

  //     mockTeacherStudentRelationshipFindAll.mockReturnValue(
  //       [
  //         { student_email: 'commonstudent1@gmail.com' },
  //         { student_email: 'commonstudent2@gmail.com' },
  //       ]
  //     );

  //     // TeacherStudentRelationship. .mockReturnValueOnce([
  //     //   { student_email: 'commonstudent1@gmail.com' },
  //     //   { student_email: 'commonstudent2@gmail.com' },
  //     // ]);

  //     const mockStudentService = new StudentService();
  //     const result = await mockStudentService.getStudentNotificationList(
  //       teacherId,
  //       studentEmails
  //     );

  //     expect(result).toBe('lol');
  //   });

  //   test('Should return zero emails', async () => {
  //     const studentEmails = ['student3@gmail.com'];
  //     const teacherId = 1;

  //     mockTeacherStudentRelationshipFindAll.mockReturnValue(
  //       [
  //         { student_email: 'commonstudent1@gmail.com' },
  //         { student_email: 'commonstudent2@gmail.com' },
  //       ]
  //     );

  //     // TeacherStudentRelationship. .mockReturnValueOnce([
  //     //   { student_email: 'commonstudent1@gmail.com' },
  //     //   { student_email: 'commonstudent2@gmail.com' },
  //     // ]);

  //     const mockStudentService = new StudentService();
  //     const result = await mockStudentService.getStudentNotificationList(
  //       teacherId,
  //       studentEmails
  //     );

  //     expect(result).toBe('lol');
  //   });
});
