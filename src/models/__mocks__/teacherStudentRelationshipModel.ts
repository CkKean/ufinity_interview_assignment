// import { Model, ModelStatic } from 'sequelize-typescript';
// import { TeacherStudentRelationship as Relationship } from '../teacherStudentRelationshipModel';

// export const mockUpsert = jest
//   .fn()
//   // .mockReturnValue([
//   //   Promise<[{ student_email: 'newStudent@gmail.com' }, true]>,
//   // ]);

// export const mockTeacherStudentRelationshipFindAll = jest
//   .fn()
//   .mockReturnValue([
//     { student_email: 'commonstudent1@gmail.com' },
//     { student_email: 'commonstudent2@gmail.com' },
//   ]);

// const mockTeacherStudentRelationship = jest
//   .fn<Partial<ModelStatic<Model<Relationship>>>, any>()
//   .mockImplementation(() => {
//     return {
//       upsert: mockUpsert,
//       findAll: mockTeacherStudentRelationshipFindAll,
//     };
//   });

// export const TeacherStudentRelationship = mockTeacherStudentRelationship();
