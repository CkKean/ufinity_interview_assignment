import { NextFunction, Request, Response } from 'express';
import { ValidationChain } from 'express-validator';
import { Model, ModelStatic } from 'sequelize-typescript';
import { TeacherStudentRelationship } from '../models/teacherStudentRelationshipModel';
import { StudentService } from '../services/studentService';
import { TeacherService } from '../services/teacherService';
import { TEST_INTERCEPTOR } from '../utils/testHelper';

jest.mock('../services/studentService');
jest.mock('../services/teacherService');
jest.mock('../models/studentModel');
jest.mock('../models/teacherModel');
jest.mock('../models/teacherStudentRelationshipModel', () => {
  const mockRelationship = jest
    .fn<Partial<ModelStatic<Model<TeacherStudentRelationship>>>, any>()
    .mockImplementation(() => {
      return {
        findAll: jest
          .fn()
          .mockReturnValue([{ student_email: 'student1@gmail.com' }]),
      };
    });

  return {
    TeacherStudentRelationship: mockRelationship(),
  };
});

let mockRequest: Partial<Request>;
let mockResponse: Partial<Response>;
let mockNext: NextFunction;
let teacherService: jest.Mock;
let studentService: jest.Mock;

const ruleValidation = async (
  rules: ValidationChain[],
  req: Request,
  res: Response,
  next: NextFunction
) => {
  await Promise.all(rules.map((validation) => validation(req, res, next)));
};

beforeEach(() => {
  mockRequest = TEST_INTERCEPTOR.mockRequest();
  mockResponse = TEST_INTERCEPTOR.mockResponse();
  mockNext = jest.fn();
  teacherService = TeacherService as jest.Mock;
  studentService = StudentService as jest.Mock;
});

afterEach(() => {
  jest.resetAllMocks();
  teacherService.mockClear();
  studentService.mockClear();
});

describe('POST /api/register', () => {
  //   test('Should return an error message "Invalid teacher email format." if the teacher email format is invalid.', async () => {
  //     mockRequest = {
  //       body: {
  //         teacher: 'teacherhon',
  //         students: ['studentjon1@gmail.com', 'studentjohn@gmail.com'],
  //       },
  //     };
  //     await ruleValidation(
  //       studentRule.forRegister,
  //       mockRequest as Request,
  //       mockResponse as Response,
  //       mockNext
  //     ); // Input Validations
  //     expect(mockNext).toBeCalledTimes(3); // Passed 3 input validations
  //     errorHandler(mockRequest as Request, mockResponse as Response, mockNext); // Error Handler Middleware
  //     expect(mockNext).toBeCalledTimes(3); // Passed 3 validations but can't pass error handler
  //     expect(mockResponse.status).toHaveBeenCalledWith(StatusCodes.BAD_REQUEST); // Status code
  //     expect(mockResponse.json).toHaveBeenCalledWith({
  //       message: 'Invalid teacher email format.',
  //     });
  //   });
  //   test('Should return an error message "Teacher email is required." if the teacher input is empty.', async () => {
  //     mockRequest = {
  //       body: {
  //         teacher: '',
  //         students: ['studentjon1@gmail.com', 'studentjohn@gmail.com'],
  //       },
  //     };
  //     await ruleValidation(
  //       studentRule.forRegister,
  //       mockRequest as Request,
  //       mockResponse as Response,
  //       mockNext
  //     ); // Input Validations
  //     expect(mockNext).toBeCalledTimes(3); // Passed 3 input validations
  //     errorHandler(mockRequest as Request, mockResponse as Response, mockNext); // Error Handler Middleware
  //     expect(mockNext).toBeCalledTimes(3); // Passed 3 validations but can't pass error handler
  //     expect(mockResponse.status).toHaveBeenCalledWith(StatusCodes.BAD_REQUEST);
  //     expect(mockResponse.json).toHaveBeenCalledWith({
  //       message: 'Teacher email is required.',
  //     });
  //   });
  //   test('Should return an error message "Teacher email is required." if the teacher input is not provided.', async () => {
  //     mockRequest = {
  //       body: {
  //         students: ['studentjon1@gmail.com', 'studentjohn@gmail.com'],
  //       },
  //     };
  //     await ruleValidation(
  //       studentRule.forRegister,
  //       mockRequest as Request,
  //       mockResponse as Response,
  //       mockNext
  //     ); // Input Validations
  //     expect(mockNext).toBeCalledTimes(3); // Passed 3 input validations
  //     errorHandler(mockRequest as Request, mockResponse as Response, mockNext); // Error Handler Middleware
  //     expect(mockNext).toBeCalledTimes(3); // Passed 3 validations but can't pass error handler
  //     expect(mockResponse.status).toHaveBeenCalledWith(StatusCodes.BAD_REQUEST);
  //     expect(mockResponse.json).toHaveBeenCalledWith({
  //       message: 'Teacher email is required.',
  //     });
  //   });
  //   test('Should return error message "Student email is required." if 0 student input.', async () => {
  //     mockRequest = {
  //       body: {
  //         teacher: 'teacherhon3@gmail.com',
  //         students: [],
  //       },
  //     };
  //     await ruleValidation(
  //       studentRule.forRegister,
  //       mockRequest as Request,
  //       mockResponse as Response,
  //       mockNext
  //     ); // Input Validations
  //     expect(mockNext).toBeCalledTimes(3); // Passed 3 input validations
  //     errorHandler(mockRequest as Request, mockResponse as Response, mockNext); // Error Handler Middleware
  //     expect(mockNext).toBeCalledTimes(3); // Passed 3 validations but can't pass error handler
  //     expect(mockResponse.status).toHaveBeenCalledWith(StatusCodes.BAD_REQUEST);
  //     expect(mockResponse.json).toHaveBeenCalledWith({
  //       message: 'Student email is required.',
  //     });
  //   });
  //   test('Should return error message "Student email is required." if students input is not provided.', async () => {
  //     mockRequest = {
  //       body: {
  //         teacher: 'teacherhon3@gmail.com',
  //       },
  //     };
  //     await ruleValidation(
  //       studentRule.forRegister,
  //       mockRequest as Request,
  //       mockResponse as Response,
  //       mockNext
  //     ); // Input Validations
  //     expect(mockNext).toBeCalledTimes(3); // Passed 3 input validations
  //     errorHandler(mockRequest as Request, mockResponse as Response, mockNext); // Error Handler Middleware
  //     expect(mockNext).toBeCalledTimes(3); // Passed 3 validations but can't pass error handler
  //     expect(mockResponse.status).toHaveBeenCalledWith(StatusCodes.BAD_REQUEST);
  //     expect(mockResponse.json).toHaveBeenCalledWith({
  //       message: 'Student email is required.',
  //     });
  //   });
  //   test('Should return error message "Invalid student(s) email format." if student email format is invalid.', async () => {
  //     mockRequest = {
  //       body: {
  //         teacher: 'teacherhon3@gmail.com',
  //         students: ['studentjon1', 'studentjohn'],
  //       },
  //     };
  //     await ruleValidation(
  //       studentRule.forRegister,
  //       mockRequest as Request,
  //       mockResponse as Response,
  //       mockNext
  //     ); // Input Validations
  //     expect(mockNext).toBeCalledTimes(3); // Passed 3 input validations
  //     errorHandler(mockRequest as Request, mockResponse as Response, mockNext); // Error Handler Middleware
  //     expect(mockNext).toBeCalledTimes(3); // Passed 3 validations but can't pass error handler
  //     expect(mockResponse.status).toHaveBeenCalledWith(StatusCodes.BAD_REQUEST);
  //     expect(mockResponse.json).toHaveBeenCalledWith({
  //       message: 'Invalid student(s) email format.',
  //     });
  //   });
  //   test('Should return message "Teacher does not exist." if the teacher does not exist.', async () => {
  //     mockRequest = {
  //       body: {
  //         teacher: 'none@gmail.com',
  //         students: ['studentjon1@gmail.com', 'studentjohn@gmail.com'],
  //       },
  //     };
  //     const error = new ErrorBase('Teacher does not exist.', StatusCodes.OK);
  //     const getByEmail = jest.fn().mockResolvedValueOnce({
  //       status: false,
  //       error: error,
  //     });
  //     teacherService.mockImplementation(() => {
  //       return {
  //         getByEmail: getByEmail,
  //       };
  //     });
  //     const register = jest.fn().mockResolvedValueOnce({
  //       status: true,
  //       message: 'Register student successfully.',
  //     });
  //     studentService.mockImplementation(() => {
  //       return {
  //         register: register as jest.Mock,
  //       };
  //     });
  //     const studentController = new StudentController();
  //     await Promise.resolve(
  //       studentController.register(
  //         mockRequest as Request,
  //         mockResponse as Response,
  //         mockNext
  //       )
  //     );
  //     expect(getByEmail).toHaveBeenCalledTimes(1);
  //     expect(register).toHaveBeenCalledTimes(0);
  //     expect(mockNext).toHaveBeenCalledTimes(1);
  //     expect(mockNext).toHaveBeenCalledWith(
  //       new ErrorBase('Teacher does not exist.', StatusCodes.OK)
  //     );
  //   });
  //   test('Should return HTTP status 204 with no content if register existing student successfully.', async () => {
  //     mockRequest = {
  //       body: {
  //         teacher: 'teacherken@gmail.com',
  //         students: ['studentjon1@gmail.com', 'studentjohn@gmail.com'],
  //       },
  //     };
  //     const getByEmail = jest.fn().mockResolvedValueOnce({
  //       status: true,
  //       data: { teacher_id: 1 },
  //       message: 'Retrieve teacher successfully.',
  //     });
  //     teacherService.mockImplementation(() => {
  //       return {
  //         getByEmail: getByEmail,
  //       };
  //     });
  //     const register = jest.fn().mockResolvedValueOnce({
  //       status: true,
  //       message: 'Register student successfully.',
  //     });
  //     studentService.mockImplementation(() => {
  //       return {
  //         register: register as jest.Mock,
  //       };
  //     });
  //     const studentController = new StudentController();
  //     await Promise.resolve(
  //       studentController.register(
  //         mockRequest as Request,
  //         mockResponse as Response,
  //         mockNext
  //       )
  //     );
  //     expect(getByEmail).toHaveBeenCalledTimes(1);
  //     expect(register).toHaveBeenCalledTimes(1);
  //     expect(mockResponse.sendStatus).toHaveBeenCalledWith(
  //       StatusCodes.NO_CONTENT
  //     );
  //   });
  //   test('Should return error message "Internal Server Error" if register student occurs server error.', async () => {
  //     mockRequest = {
  //       body: {
  //         teacher: 'teacherken@gmail.com',
  //         students: ['studentjon1@gmail.com', 'studentjohn@gmail.com'],
  //       },
  //     };
  //     const getByEmail = jest.fn().mockResolvedValueOnce({
  //       status: true,
  //       data: { teacher_id: 1 },
  //       message: 'Retrieve teacher successfully.',
  //     });
  //     teacherService.mockImplementation(() => {
  //       return {
  //         getByEmail: getByEmail,
  //       };
  //     });
  //   const error = new Error('Internal Server Error')
  //     const register = jest.fn().mockResolvedValueOnce({
  //       status: false,
  //       error: error,
  //     });
  //     studentService.mockImplementation(() => {
  //       return {
  //         register: register as jest.Mock,
  //       };
  //     });
  //     const studentController = new StudentController();
  //     await Promise.resolve(
  //       studentController.register(
  //         mockRequest as Request,
  //         mockResponse as Response,
  //         mockNext
  //       )
  //     );
  //     expect(getByEmail).toHaveBeenCalledTimes(1);
  //     expect(register).toHaveBeenCalledTimes(1);
  //     expect(mockNext).toHaveBeenCalledTimes(1);
  //     expect(mockNext).toHaveBeenCalledWith(error);
  //   });
  //   test('Should return HTTP status 204 with no content if register a new student successfully.', async () => {
  //     mockRequest = {
  //       body: {
  //         teacher: 'teacherken@gmail.com',
  //         students: ['newStudent1@gmail.com'],
  //       },
  //     };
  //     const getByEmail = jest.fn().mockResolvedValueOnce({
  //       status: true,
  //       data: { teacher_id: 1 },
  //       message: 'Retrieve teacher successfully.',
  //     });
  //     teacherService.mockImplementation(() => {
  //       return {
  //         getByEmail: getByEmail,
  //       };
  //     });
  //     const register = jest.fn().mockResolvedValueOnce({
  //       status: true,
  //       message: 'Register student successfully.',
  //     });
  //     studentService.mockImplementation(() => {
  //       return {
  //         register: register as jest.Mock,
  //       };
  //     });
  //     const studentController = new StudentController();
  //     await Promise.resolve(
  //       studentController.register(
  //         mockRequest as Request,
  //         mockResponse as Response,
  //         mockNext
  //       )
  //     );
  //     expect(getByEmail).toHaveBeenCalledTimes(1);
  //     expect(register).toHaveBeenCalledTimes(1);
  //     expect(mockResponse.sendStatus).toHaveBeenCalledWith(
  //       StatusCodes.NO_CONTENT
  //     );
  //   });
  //   test('Should return HTTP status 204 with no content if register multiple new students successfully.', async () => {
  //     mockRequest = {
  //       body: {
  //         teacher: 'teacherken@gmail.com',
  //         students: ['newStudent2@gmail.com', 'newStudent3@gmail.com'],
  //       },
  //     };
  //     const getByEmail = jest.fn().mockResolvedValueOnce({
  //       status: true,
  //       data: { teacher_id: 1 },
  //       message: 'Retrieve teacher successfully.',
  //     });
  //     teacherService.mockImplementation(() => {
  //       return {
  //         getByEmail: getByEmail,
  //       };
  //     });
  //     const register = jest.fn().mockResolvedValueOnce({
  //       status: true,
  //       message: 'Register student successfully.',
  //     });
  //     studentService.mockImplementation(() => {
  //       return {
  //         register: register as jest.Mock,
  //       };
  //     });
  //     const studentController = new StudentController();
  //     await Promise.resolve(
  //       studentController.register(
  //         mockRequest as Request,
  //         mockResponse as Response,
  //         mockNext
  //       )
  //     );
  //     expect(getByEmail).toHaveBeenCalledTimes(1);
  //     expect(register).toHaveBeenCalledTimes(1);
  //     expect(mockResponse.sendStatus).toHaveBeenCalledWith(
  //       StatusCodes.NO_CONTENT
  //     );
  //   });
  //   test('Should register students successfully and return success status', async () => {
  //     // Arrange
  //     const students = ['student1@gmail.com', 'student2@gmail.com'];
  //     const teacherId = 1;
  //     const response = [
  //       {
  //         student_id: 1,
  //       },
  //       {
  //         student_id: 2,
  //       },
  //     ];
  //     // Act
  //     const findOrCreate = jest.fn().mockResolvedValueOnce([
  //       {
  //         student_id: 1,
  //       },
  //       {
  //         student_id: 2,
  //       },
  //     ]);
  //     Student.mockImplementation(() => {
  //       return {
  //         getByEmail: getByEmail,
  //       };
  //     });
  //     const userModelMock = {
  //       findByPk: jest.fn().mockResolvedValueOnce(userModelInstanceMock),
  //     };
  //     // Assert
  //     const mockStudentService = new StudentService();
  //     const result = await mockStudentService.register({ students, teacherId });
  //     expect(result).toEqual({
  //       status: true,
  //       message: 'Register student successfully.',
  //     });
  //     // expect(mockFindOrCreate).toHaveBeenCalledTimes(students.length);
  //     // expect(mockUpsert).toHaveBeenCalledTimes(students.length);
  //     // expect(result.status).toBe(true);
  //     // expect(result.message).toBe('Register student successfully.');
  //   });
});

describe('POST /api/commonstudents', () => {
  //   test('Should return error message "Teacher email is required." if teacher parameter input is not provided.', async () => {
  //     mockRequest = {
  //       query: {},
  //     };
  //     await ruleValidation(
  //       studentRule.forCommonStudents,
  //       mockRequest as Request,
  //       mockResponse as Response,
  //       mockNext
  //     ); // Input Validations
  //     expect(mockNext).toBeCalledTimes(1); // Passed 3 input validations
  //     errorHandler(mockRequest as Request, mockResponse as Response, mockNext); // Error Handler Middleware
  //     expect(mockNext).toBeCalledTimes(1); // Passed 3 validations but can't pass error handler
  //     expect(mockResponse.status).toHaveBeenCalledWith(StatusCodes.BAD_REQUEST); // Status code
  //     expect(mockResponse.json).toHaveBeenCalledWith({
  //       message: 'Teacher email is required.',
  //     });
  //   });
  //   test('Should return error message "Teacher email is required." if teacher input is empty string.', async () => {
  //     mockRequest = {
  //       query: {
  //         teacher: '',
  //       },
  //     };
  //     await ruleValidation(
  //       studentRule.forCommonStudents,
  //       mockRequest as Request,
  //       mockResponse as Response,
  //       mockNext
  //     ); // Input Validations
  //     expect(mockNext).toBeCalledTimes(1); // Passed 3 input validations
  //     errorHandler(mockRequest as Request, mockResponse as Response, mockNext); // Error Handler Middleware
  //     expect(mockNext).toBeCalledTimes(1); // Passed 3 validations but can't pass error handler
  //     expect(mockResponse.status).toHaveBeenCalledWith(StatusCodes.BAD_REQUEST); // Status code
  //     expect(mockResponse.json).toHaveBeenCalledWith({
  //       message: 'Teacher email is required.',
  //     });
  //   });
  //   test('Should return error message "Invalid teacher email format." if teacher email format is invalid.', async () => {
  //     mockRequest = {
  //       query: {
  //         teacher: ['teacherkencom', 'teacherkangcom'],
  //       },
  //     };
  //     await ruleValidation(
  //       studentRule.forCommonStudents,
  //       mockRequest as Request,
  //       mockResponse as Response,
  //       mockNext
  //     ); // Input Validations
  //     expect(mockNext).toBeCalledTimes(1); // Passed 3 input validations
  //     errorHandler(mockRequest as Request, mockResponse as Response, mockNext); // Error Handler Middleware
  //     expect(mockNext).toBeCalledTimes(1); // Passed 3 validations but can't pass error handler
  //     expect(mockResponse.status).toHaveBeenCalledWith(StatusCodes.BAD_REQUEST); // Status code
  //     expect(mockResponse.json).toHaveBeenCalledWith({
  //       message: 'Invalid teacher email format.',
  //     });
  //   });
  //   test('Should return the list of students common given a teacher', async () => {
  //     mockRequest = {
  //       query: {
  //         teacher: ['teacherken@gmail.com'],
  //       },
  //     };
  //     const responseData = [
  //       'commonstudent1@gmail.com',
  //       'commonstudent2@gmail.com',
  //       'commonstudent5@gmail.com',
  //     ];
  //     const getCommonStudent = jest.fn().mockResolvedValueOnce({
  //       status: true,
  //       data: responseData,
  //       message: 'Retrieve common student successfully.',
  //     });
  //     studentService.mockImplementation(() => {
  //       return {
  //         getCommonStudent: getCommonStudent as jest.Mock,
  //       };
  //     });
  //     const studentController = new StudentController();
  //     await Promise.resolve(
  //       studentController.getCommonStudents(
  //         mockRequest as Request,
  //         mockResponse as Response,
  //         mockNext
  //       )
  //     );
  //     expect(getCommonStudent).toHaveBeenCalledTimes(1);
  //     expect(mockResponse.status).toHaveBeenCalledWith(StatusCodes.OK);
  //     expect(mockResponse.json).toHaveBeenCalledWith({
  //       students: responseData,
  //     });
  //   });
  //   test('Should return the list of students common given a list of teachers', async () => {
  //     mockRequest = {
  //       query: {
  //         teacher: ['teacherken@gmail.com', 'teacherjoe@gmail.com'],
  //       },
  //     };
  //     const responseData = [
  //       'commonstudent1@gmail.com',
  //       'commonstudent2@gmail.com',
  //       'commonstudent5@gmail.com',
  //       'commonstudent3@gmail.com',
  //     ];
  //     const getCommonStudent = jest.fn().mockResolvedValueOnce({
  //       status: true,
  //       data: responseData,
  //       message: 'Retrieve common student successfully.',
  //     });
  //     studentService.mockImplementation(() => {
  //       return {
  //         getCommonStudent: getCommonStudent as jest.Mock,
  //       };
  //     });
  //     const studentController = new StudentController();
  //     await Promise.resolve(
  //       studentController.getCommonStudents(
  //         mockRequest as Request,
  //         mockResponse as Response,
  //         mockNext
  //       )
  //     );
  //     expect(getCommonStudent).toHaveBeenCalledTimes(1);
  //     expect(mockResponse.status).toHaveBeenCalledWith(StatusCodes.OK);
  //     expect(mockResponse.json).toHaveBeenCalledWith({ students: responseData });
  //   });
  //   test('Should return the zero students', async () => {
  //     mockRequest = {
  //       query: {
  //         teacher: ['none@gmail.com'],
  //       },
  //     };
  //     const responseData: string[] = [];
  //     const getCommonStudent = jest.fn().mockResolvedValueOnce({
  //       status: true,
  //       data: responseData,
  //       message: 'Retrieve common student successfully.',
  //     });
  //     studentService.mockImplementation(() => {
  //       return {
  //         getCommonStudent: getCommonStudent as jest.Mock,
  //       };
  //     });
  //     const studentController = new StudentController();
  //     await Promise.resolve(
  //       studentController.getCommonStudents(
  //         mockRequest as Request,
  //         mockResponse as Response,
  //         mockNext
  //       )
  //     );
  //     expect(getCommonStudent).toHaveBeenCalledTimes(1);
  //     expect(mockResponse.status).toHaveBeenCalledWith(StatusCodes.OK);
  //     expect(mockResponse.json).toHaveBeenCalledWith({ students: responseData });
  //   });
  //   test('Should return error message "Internal Server Error" if get common student occurs server error.', async () => {
  //     mockRequest = {
  //       query: {
  //         teacher: ['teacherken@gmail.com'],
  //       },
  //     };
  //     const error = new Error('Internal Server Error');
  //     const getCommonStudent = jest.fn().mockResolvedValueOnce({
  //       status: false,
  //       error: error,
  //     });
  //     studentService.mockImplementation(() => {
  //       return {
  //         getCommonStudent: getCommonStudent as jest.Mock,
  //       };
  //     });
  //     const studentController = new StudentController();
  //     await Promise.resolve(
  //       studentController.getCommonStudents(
  //         mockRequest as Request,
  //         mockResponse as Response,
  //         mockNext
  //       )
  //     );
  //     expect(getCommonStudent).toHaveBeenCalledTimes(1);
  //     expect(mockNext).toHaveBeenCalledTimes(1);
  //     expect(mockNext).toHaveBeenCalledWith(error);
  //   });
});

describe('POST /api/suspend', () => {
  //   test('Should return an error message "Invalid student email format." if student email format is invalid.', async () => {
  //     mockRequest = {
  //       body: {
  //         student: 'commonstudent4',
  //       },
  //     };
  //     await ruleValidation(
  //       studentRule.forSuspend,
  //       mockRequest as Request,
  //       mockResponse as Response,
  //       mockNext
  //     ); // Input Validations
  //     expect(mockNext).toBeCalledTimes(1); // Passed 3 input validations
  //     errorHandler(mockRequest as Request, mockResponse as Response, mockNext); // Error Handler Middleware
  //     expect(mockNext).toBeCalledTimes(1); // Passed 3 validations but can't pass error handler
  //     expect(mockResponse.status).toHaveBeenCalledWith(StatusCodes.BAD_REQUEST); // Status code
  //     expect(mockResponse.json).toHaveBeenCalledWith({
  //       message: 'Invalid student email format.',
  //     });
  //   });
  //   test('Should return an error message "Student email is required." if student email is empty string.', async () => {
  //     mockRequest = {
  //       body: {
  //         student: '',
  //       },
  //     };
  //     await ruleValidation(
  //       studentRule.forSuspend,
  //       mockRequest as Request,
  //       mockResponse as Response,
  //       mockNext
  //     ); // Input Validations
  //     expect(mockNext).toBeCalledTimes(1); // Passed 3 input validations
  //     errorHandler(mockRequest as Request, mockResponse as Response, mockNext); // Error Handler Middleware
  //     expect(mockNext).toBeCalledTimes(1); // Passed 3 validations but can't pass error handler
  //     expect(mockResponse.status).toHaveBeenCalledWith(StatusCodes.BAD_REQUEST); // Status code
  //     expect(mockResponse.json).toHaveBeenCalledWith({
  //       message: 'Student email is required.',
  //     });
  //   });
  //   test('Should return an error message "Student email is required." if student email input is not provided.', async () => {
  //     mockRequest = {
  //       body: {},
  //     };
  //     await ruleValidation(
  //       studentRule.forSuspend,
  //       mockRequest as Request,
  //       mockResponse as Response,
  //       mockNext
  //     ); // Input Validations
  //     expect(mockNext).toBeCalledTimes(1); // Passed 3 input validations
  //     errorHandler(mockRequest as Request, mockResponse as Response, mockNext); // Error Handler Middleware
  //     expect(mockNext).toBeCalledTimes(1); // Passed 3 validations but can't pass error handler
  //     expect(mockResponse.status).toHaveBeenCalledWith(StatusCodes.BAD_REQUEST); // Status code
  //     expect(mockResponse.json).toHaveBeenCalledWith({
  //       message: 'Student email is required.',
  //     });
  //   });
  //   test('Should return error message "Student was in suspended status." if suspend a suspended student.', async () => {
  //     mockRequest = {
  //       body: {
  //         student: 'commonstudent5@gmail.com',
  //       },
  //     };
  //     const error = new ErrorBase('Student does not exist.', StatusCodes.OK);
  //     const suspend = jest.fn().mockResolvedValueOnce({
  //       status: false,
  //       error: error,
  //     });
  //     studentService.mockImplementation(() => {
  //       return {
  //         suspend: suspend as jest.Mock,
  //       };
  //     });
  //     const studentController = new StudentController();
  //     await Promise.resolve(
  //       studentController.suspend(
  //         mockRequest as Request,
  //         mockResponse as Response,
  //         mockNext
  //       )
  //     );
  //     expect(suspend).toHaveBeenCalledTimes(1);
  //     expect(mockNext).toHaveBeenCalledTimes(1);
  //     expect(mockNext).toHaveBeenCalledWith(error);
  //   });
  //   test('Should return HTTP status 204 with no content after suspend successfully.', async () => {
  //     mockRequest = {
  //       body: {
  //         student: 'commonstudent4@gmail.com',
  //       },
  //     };
  //     const suspend = jest.fn().mockResolvedValueOnce({
  //       status: true,
  //       message: 'Suspend student successfully.',
  //     });
  //     studentService.mockImplementation(() => {
  //       return {
  //         suspend: suspend as jest.Mock,
  //       };
  //     });
  //     const studentController = new StudentController();
  //     await Promise.resolve(
  //       studentController.suspend(
  //         mockRequest as Request,
  //         mockResponse as Response,
  //         mockNext
  //       )
  //     );
  //     expect(suspend).toHaveBeenCalledTimes(1);
  //     expect(mockResponse.sendStatus).toHaveBeenCalledWith(
  //       StatusCodes.NO_CONTENT
  //     );
  //   });
  //   test('Should return error message "Student does not exist." if the student email does not exist.', async () => {
  //     mockRequest = {
  //       body: {
  //         student: 'none@gmail.com',
  //       },
  //     };
  //     const error = new ErrorBase('Student does not exist.', StatusCodes.OK);
  //     const suspend = jest.fn().mockResolvedValueOnce({
  //       status: false,
  //       error,
  //     });
  //     studentService.mockImplementation(() => {
  //       return {
  //         suspend: suspend as jest.Mock,
  //       };
  //     });
  //     const studentController = new StudentController();
  //     await Promise.resolve(
  //       studentController.suspend(
  //         mockRequest as Request,
  //         mockResponse as Response,
  //         mockNext
  //       )
  //     );
  //     expect(suspend).toHaveBeenCalledTimes(1);
  //     expect(mockNext).toHaveBeenCalledTimes(1);
  //     expect(mockNext).toHaveBeenCalledWith(error);
  //   });
  //   test('Should return error message "Internal Server Error" if suspend student occurs server error.', async () => {
  //     mockRequest = {
  //       query: {
  //         teacher: ['teacherken@gmail.com'],
  //       },
  //     };
  //     const error = new Error('Internal Server Error');
  //     const suspend = jest.fn().mockResolvedValueOnce({
  //       status: false,
  //       error: error,
  //     });
  //     studentService.mockImplementation(() => {
  //       return {
  //         suspend: suspend as jest.Mock,
  //       };
  //     });
  //     const studentController = new StudentController();
  //     await Promise.resolve(
  //       studentController.suspend(
  //         mockRequest as Request,
  //         mockResponse as Response,
  //         mockNext
  //       )
  //     );
  //     expect(suspend).toHaveBeenCalledTimes(1);
  //     expect(mockNext).toHaveBeenCalledTimes(1);
  //     expect(mockNext).toHaveBeenCalledWith(error);
  //   });
});

describe('POST /api/retrievefornotifications', () => {
  //   test('Should return error message "Invalid teacher email format." if teacher email format is invalid.', async () => {
  //     mockRequest = {
  //       body: {
  //         teacher: 'teacher@',
  //         notification: 'Hello students!',
  //       },
  //     };
  //     await ruleValidation(
  //       studentRule.forRetrieveNotifications,
  //       mockRequest as Request,
  //       mockResponse as Response,
  //       mockNext
  //     ); // Input Validations
  //     expect(mockNext).toBeCalledTimes(2); // Passed 3 input validations
  //     errorHandler(mockRequest as Request, mockResponse as Response, mockNext); // Error Handler Middleware
  //     expect(mockNext).toBeCalledTimes(2); // Passed 3 validations but can't pass error handler
  //     expect(mockResponse.status).toHaveBeenCalledWith(StatusCodes.BAD_REQUEST); // Status code
  //     expect(mockResponse.json).toHaveBeenCalledWith({
  //       message: 'Invalid teacher email format.',
  //     });
  //   });
  //   test('Should return error message "Teacher email is required." if teacher email is empty string.', async () => {
  //     mockRequest = {
  //       body: {
  //         teacher: '',
  //         notification: 'Hello students!',
  //       },
  //     };
  //     await ruleValidation(
  //       studentRule.forRetrieveNotifications,
  //       mockRequest as Request,
  //       mockResponse as Response,
  //       mockNext
  //     ); // Input Validations
  //     expect(mockNext).toBeCalledTimes(2); // Passed 3 input validations
  //     errorHandler(mockRequest as Request, mockResponse as Response, mockNext); // Error Handler Middleware
  //     expect(mockNext).toBeCalledTimes(2); // Passed 3 validations but can't pass error handler
  //     expect(mockResponse.status).toHaveBeenCalledWith(StatusCodes.BAD_REQUEST); // Status code
  //     expect(mockResponse.json).toHaveBeenCalledWith({
  //       message: 'Teacher email is required.',
  //     });
  //   });
  //   test('Should return error message "Teacher email is required." if teacher email input is not provided.', async () => {
  //     mockRequest = {
  //       body: { notification: 'Hello students!' },
  //     };
  //     await ruleValidation(
  //       studentRule.forRetrieveNotifications,
  //       mockRequest as Request,
  //       mockResponse as Response,
  //       mockNext
  //     ); // Input Validations
  //     expect(mockNext).toBeCalledTimes(2); // Passed 3 input validations
  //     errorHandler(mockRequest as Request, mockResponse as Response, mockNext); // Error Handler Middleware
  //     expect(mockNext).toBeCalledTimes(2); // Passed 3 validations but can't pass error handler
  //     expect(mockResponse.status).toHaveBeenCalledWith(StatusCodes.BAD_REQUEST); // Status code
  //     expect(mockResponse.json).toHaveBeenCalledWith({
  //       message: 'Teacher email is required.',
  //     });
  //   });
  //   test('Should return error message "Notification is required." if notification is empty string', async () => {
  //     mockRequest = {
  //       body: {
  //         teacher: 'teacherken@gmail.com',
  //         notification: '',
  //       },
  //     };
  //     await ruleValidation(
  //       studentRule.forRetrieveNotifications,
  //       mockRequest as Request,
  //       mockResponse as Response,
  //       mockNext
  //     ); // Input Validations
  //     expect(mockNext).toBeCalledTimes(2); // Passed 3 input validations
  //     errorHandler(mockRequest as Request, mockResponse as Response, mockNext); // Error Handler Middleware
  //     expect(mockNext).toBeCalledTimes(2); // Passed 3 validations but can't pass error handler
  //     expect(mockResponse.status).toHaveBeenCalledWith(StatusCodes.BAD_REQUEST); // Status code
  //     expect(mockResponse.json).toHaveBeenCalledWith({
  //       message: 'Notification is required.',
  //     });
  //   });
  //   test('Should return error message "Notification is required." if notification input is not provided.', async () => {
  //     mockRequest = {
  //       body: {
  //         teacher: 'teacherken@gmail.com',
  //       },
  //     };
  //     await ruleValidation(
  //       studentRule.forRetrieveNotifications,
  //       mockRequest as Request,
  //       mockResponse as Response,
  //       mockNext
  //     ); // Input Validations
  //     expect(mockNext).toBeCalledTimes(2); // Passed 3 input validations
  //     errorHandler(mockRequest as Request, mockResponse as Response, mockNext); // Error Handler Middleware
  //     expect(mockNext).toBeCalledTimes(2); // Passed 3 validations but can't pass error handler
  //     expect(mockResponse.status).toHaveBeenCalledWith(StatusCodes.BAD_REQUEST); // Status code
  //     expect(mockResponse.json).toHaveBeenCalledWith({
  //       message: 'Notification is required.',
  //     });
  //   });
  //   test('Should return a list of registered student email only.', async () => {
  //     mockRequest = {
  //       body: {
  //         teacher: 'teacherken@gmail.com',
  //         notification: 'Hello students',
  //       },
  //     };
  //     await ruleValidation(
  //       studentRule.forRetrieveNotifications,
  //       mockRequest as Request,
  //       mockResponse as Response,
  //       mockNext
  //     ); // Input Validations
  //     const getByEmail = jest.fn().mockResolvedValueOnce({
  //       status: true,
  //       data: { teacher_id: 1 },
  //       message: 'Retrieve teacher successfully.',
  //     });
  //     teacherService.mockImplementation(() => {
  //       return {
  //         getByEmail: getByEmail as jest.Mock,
  //       };
  //     });
  //     const data = ['commonstudent1@gmail.com', 'commonstudent2@gmail.com'];
  //     const studentNotificationList = jest.fn().mockResolvedValueOnce({
  //       status: true,
  //       data: data,
  //       message: 'Retrieve student common successfully',
  //     });
  //     studentService.mockImplementation(() => {
  //       return {
  //         getStudentNotificationList: studentNotificationList as jest.Mock,
  //       };
  //     });
  //     const studentController = new StudentController();
  //     await Promise.resolve(
  //       studentController.getNotificationList(
  //         mockRequest as Request,
  //         mockResponse as Response,
  //         mockNext
  //       )
  //     );
  //     expect(getByEmail).toHaveBeenCalledTimes(1);
  //     expect(studentNotificationList).toHaveBeenCalledTimes(1);
  //     expect(studentNotificationList).toHaveBeenLastCalledWith(1, []);
  //     expect(mockResponse.status).toHaveBeenCalledWith(StatusCodes.OK);
  //     expect(mockResponse.json).toHaveBeenCalledWith({
  //       recipients: data,
  //     });
  //   });
  //   test('Should return a list of email mentioned in notification and registered student email.', async () => {
  //     mockRequest = {
  //       body: {
  //         teacher: 'teacherken@gmail.com',
  //         notification:
  //           'Hello students! @studentagnes@gmail.com @studentmiche@gmail.com',
  //       },
  //     };
  //     await ruleValidation(
  //       studentRule.forRetrieveNotifications,
  //       mockRequest as Request,
  //       mockResponse as Response,
  //       mockNext
  //     ); // Input Validations
  //     const getByEmail = jest.fn().mockResolvedValueOnce({
  //       status: true,
  //       data: { teacher_id: 1 },
  //       message: 'Retrieve teacher successfully.',
  //     });
  //     teacherService.mockImplementation(() => {
  //       return {
  //         getByEmail: getByEmail,
  //       };
  //     });
  //     const data = [
  //       'commonstudent1@gmail.com',
  //       'commonstudent2@gmail.com',
  //       'studentagnes@gmail.com',
  //       'studentmiche@gmail.com',
  //     ];
  //     const getStudentNotificationList = jest.fn().mockResolvedValueOnce({
  //       status: true,
  //       data: data,
  //       message: 'Retrieve student common successfully',
  //     });
  //     studentService.mockImplementation(() => {
  //       return {
  //         getStudentNotificationList: getStudentNotificationList,
  //       };
  //     });
  //     const studentController = new StudentController();
  //     await Promise.resolve(
  //       studentController.getNotificationList(
  //         mockRequest as Request,
  //         mockResponse as Response,
  //         mockNext
  //       )
  //     );
  //     expect(getByEmail).toHaveBeenCalledTimes(1);
  //     expect(getStudentNotificationList).toHaveBeenCalledTimes(1);
  //     expect(getStudentNotificationList).toHaveBeenLastCalledWith(1, [
  //       'studentagnes@gmail.com',
  //       'studentmiche@gmail.com',
  //     ]);
  //     expect(mockResponse.status).toHaveBeenCalledWith(StatusCodes.OK);
  //     expect(mockResponse.json).toHaveBeenCalledWith({
  //       recipients: data,
  //     });
  //   });
  //   test('Should return a list of email mentioned in notification and registered student email without any repetitions.', async () => {
  //     mockRequest = {
  //       body: {
  //         teacher: 'teacherken@gmail.com',
  //         notification:
  //           'Hello students! @studentagnes@gmail.com@studentagnes@gmail.com',
  //       },
  //     };
  //     await ruleValidation(
  //       studentRule.forRetrieveNotifications,
  //       mockRequest as Request,
  //       mockResponse as Response,
  //       mockNext
  //     ); // Input Validations
  //     const getByEmail = jest.fn().mockResolvedValueOnce({
  //       status: true,
  //       data: { teacher_id: 1 },
  //       message: 'Retrieve teacher successfully.',
  //     });
  //     teacherService.mockImplementation(() => {
  //       return {
  //         getByEmail: getByEmail,
  //       };
  //     });
  //     const data = [
  //       'commonstudent1@gmail.com',
  //       'commonstudent2@gmail.com',
  //       'studentagnes@gmail.com',
  //     ];
  //     const getStudentNotificationList = jest.fn().mockResolvedValueOnce({
  //       status: true,
  //       data: data,
  //       message: 'Retrieve student common successfully',
  //     });
  //     studentService.mockImplementation(() => {
  //       return {
  //         getStudentNotificationList: getStudentNotificationList,
  //       };
  //     });
  //     const studentController = new StudentController();
  //     await Promise.resolve(
  //       studentController.getNotificationList(
  //         mockRequest as Request,
  //         mockResponse as Response,
  //         mockNext
  //       )
  //     );
  //     expect(getByEmail).toHaveBeenCalledTimes(1);
  //     expect(getStudentNotificationList).toHaveBeenCalledTimes(1);
  //     expect(getStudentNotificationList).toHaveBeenLastCalledWith(1, [
  //       'studentagnes@gmail.com',
  //     ]);
  //     expect(mockResponse.status).toHaveBeenCalledWith(StatusCodes.OK);
  //     expect(mockResponse.json).toHaveBeenCalledWith({
  //       recipients: data,
  //     });
  //   });
  //   test('Should return zero student email', async () => {
  //     mockRequest = {
  //       body: {
  //         teacher: 'teacherping@gmail.com',
  //         notification: 'Hello students',
  //       },
  //     };
  //     await ruleValidation(
  //       studentRule.forRetrieveNotifications,
  //       mockRequest as Request,
  //       mockResponse as Response,
  //       mockNext
  //     ); // Input Validations
  //     const getByEmail = jest.fn().mockResolvedValueOnce({
  //       status: true,
  //       data: { teacher_id: 1 },
  //       message: 'Retrieve teacher successfully.',
  //     });
  //     teacherService.mockImplementation(() => {
  //       return {
  //         getByEmail: getByEmail,
  //       };
  //     });
  //     const data: string[] = [];
  //     const getStudentNotificationList = jest.fn().mockResolvedValueOnce({
  //       status: true,
  //       data: data,
  //       message: 'Retrieve student common successfully',
  //     });
  //     studentService.mockImplementation(() => {
  //       return {
  //         getStudentNotificationList: getStudentNotificationList,
  //       };
  //     });
  //     const studentController = new StudentController();
  //     await Promise.resolve(
  //       studentController.getNotificationList(
  //         mockRequest as Request,
  //         mockResponse as Response,
  //         mockNext
  //       )
  //     );
  //     expect(getByEmail).toHaveBeenCalledTimes(1);
  //     expect(getStudentNotificationList).toHaveBeenCalledTimes(1);
  //     expect(getStudentNotificationList).toHaveBeenLastCalledWith(1, []);
  //     expect(mockResponse.status).toHaveBeenCalledWith(StatusCodes.OK);
  //     expect(mockResponse.json).toHaveBeenCalledWith({
  //       recipients: data,
  //     });
  //   });
  //   test('Should return message "Teacher does not exist." if the teacher does not exist.', async () => {
  //     mockRequest = {
  //       query: {
  //         teacher: 'teacherken@gmail.com'.trim(), // Trim() is Sanitze
  //         notification: 'Hello students'.trim(), // Trim() is Sanitze
  //       },
  //     };
  //     const getByEmailError = new ErrorBase(
  //       'Teacher does not exist.',
  //       StatusCodes.OK
  //     );
  //     const getByEmail = jest.fn().mockResolvedValueOnce({
  //       status: false,
  //       error: getByEmailError,
  //     });
  //     teacherService.mockImplementation(() => {
  //       return {
  //         getByEmail: getByEmail,
  //       };
  //     });
  //     const data: string[] = [];
  //     const getStudentNotificationList = jest.fn().mockResolvedValueOnce({
  //       status: true,
  //       data: data,
  //       message: 'Retrieve student common successfully',
  //     });
  //     studentService.mockImplementation(() => {
  //       return {
  //         getStudentNotificationList: getStudentNotificationList,
  //       };
  //     });
  //     const studentController = new StudentController();
  //     await Promise.resolve(
  //       studentController.getNotificationList(
  //         mockRequest as Request,
  //         mockResponse as Response,
  //         mockNext
  //       )
  //     );
  //     expect(getByEmail).toHaveBeenCalledTimes(1);
  //     expect(getStudentNotificationList).toHaveBeenCalledTimes(0);
  //     expect(mockNext).toHaveBeenCalledTimes(1);
  //     expect(mockNext).toHaveBeenCalledWith(getByEmailError);
  //   });
  //   test('Should return error message "Internal Server Error" if retrieve student notification occurs server error.', async () => {
  //     mockRequest = {
  //       query: {
  //         teacher: 'teacherken@gmail.com'.trim(),
  //         notification: 'Hello students'.trim(),
  //       },
  //     };
  //     await ruleValidation(
  //       studentRule.forRetrieveNotifications,
  //       mockRequest as Request,
  //       mockResponse as Response,
  //       mockNext
  //     ); // Input Validations
  //     const getByEmail = jest.fn().mockResolvedValueOnce({
  //       status: true,
  //       data: { teacher_id: 1 },
  //       message: 'Retrieve teacher successfully.',
  //     });
  //     teacherService.mockImplementation(() => {
  //       return {
  //         getByEmail: getByEmail,
  //       };
  //     });
  //     const error = new Error('Internal Server Error');
  //     const getStudentNotificationList = jest.fn().mockResolvedValueOnce({
  //       status: false,
  //       error,
  //     });
  //     studentService.mockImplementation(() => {
  //       return {
  //         getStudentNotificationList: getStudentNotificationList,
  //       };
  //     });
  //     const studentController = new StudentController();
  //     await Promise.resolve(
  //       studentController.getNotificationList(
  //         mockRequest as Request,
  //         mockResponse as Response,
  //         mockNext
  //       )
  //     );
  //     expect(getByEmail).toHaveBeenCalledTimes(1);
  //     expect(getStudentNotificationList).toHaveBeenCalledTimes(1);
  //     expect(mockNext).toHaveBeenCalledTimes(3);
  //     expect(mockNext).toHaveBeenCalledWith(error);
  //   });
});
