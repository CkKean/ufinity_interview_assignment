import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { StudentController } from '../../controllers/studentController';
import ErrorBase from '../../errors/ErrorBase';
import { studentRule } from '../../middlewares/rules/studentRule';
import { Teacher } from '../../models/teacherModel';
import { StudentService } from '../../services/studentService';
import { TeacherService } from '../../services/teacherService';
import { TEST_INTERCEPTOR } from '../../utils/testHelper';

jest.mock('../../services/studentService');
jest.mock('../../services/teacherService');

let mockRequest: Partial<Request>;
let mockResponse: Partial<Response>;
let mockNext: NextFunction;

beforeEach(() => {
  mockRequest = TEST_INTERCEPTOR.mockRequest();
  mockResponse = TEST_INTERCEPTOR.mockResponse();
  mockNext = jest.fn();
});

afterEach(() => {
  jest.resetAllMocks();
});

describe('Test register controller function', () => {
  test('Should return message "Teacher does not exist." if the teacher does not exist.', async () => {
    mockRequest = {
      body: {
        teacher: 'none@gmail.com',
        students: ['studentjon1@gmail.com', 'studentjohn@gmail.com'],
      },
    };

    await TEST_INTERCEPTOR.ruleValidation(
      studentRule.forRegister,
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    const error = new ErrorBase('Teacher does not exist.', StatusCodes.OK);
    const getByEmail = jest
      .spyOn(TeacherService.prototype, 'getByEmail')
      .mockResolvedValueOnce({
        status: false,
        error: error,
      });

    const register = jest
      .spyOn(StudentService.prototype, 'register')
      .mockResolvedValueOnce({
        status: true,
        message: 'Register student successfully.',
      });

    await Promise.resolve(
      StudentController.register(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      )
    );

    expect(getByEmail).toHaveBeenCalledTimes(1);
    expect(register).toHaveBeenCalledTimes(0);
    expect(mockNext).toHaveBeenCalledTimes(4); // Include validation next
    expect(mockNext).toHaveBeenCalledWith(
      new ErrorBase('Teacher does not exist.', StatusCodes.OK)
    );
  });

  test('Should return HTTP status 204 with no content if register existing student successfully.', async () => {
    mockRequest = {
      body: {
        teacher: 'teacherken@gmail.com',
        students: ['studentjon1@gmail.com', 'studentjohn@gmail.com'],
      },
    };

    await TEST_INTERCEPTOR.ruleValidation(
      studentRule.forRegister,
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    const getByEmail = jest
      .spyOn(TeacherService.prototype, 'getByEmail')
      .mockResolvedValueOnce({
        status: true,
        data: { teacher_id: 1 } as Teacher,
        message: 'Retrieve teacher successfully.',
      });

    const register = jest
      .spyOn(StudentService.prototype, 'register')
      .mockResolvedValueOnce({
        status: true,
        message: 'Register student successfully.',
      });

    await Promise.resolve(
      StudentController.register(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      )
    );
    expect(getByEmail).toHaveBeenCalledTimes(1);
    expect(register).toHaveBeenCalledTimes(1);
    expect(mockNext).toHaveBeenCalledTimes(3);
    expect(mockResponse.sendStatus).toHaveBeenCalledWith(
      StatusCodes.NO_CONTENT
    );
  });

  test('Should return error message "Internal Server Error" if register student occurs server error.', async () => {
    mockRequest = {
      body: {
        teacher: 'teacherken@gmail.com',
        students: ['studentjon1@gmail.com', 'studentjohn@gmail.com'],
      },
    };

    await TEST_INTERCEPTOR.ruleValidation(
      studentRule.forRegister,
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    const getByEmail = jest
      .spyOn(TeacherService.prototype, 'getByEmail')
      .mockResolvedValueOnce({
        status: true,
        data: { teacher_id: 1 } as Teacher,
        message: 'Retrieve teacher successfully.',
      });

    const error = new Error('Internal Server Error');
    const register = jest
      .spyOn(StudentService.prototype, 'register')
      .mockResolvedValueOnce({
        status: false,
        error: error,
      });

    await Promise.resolve(
      StudentController.register(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      )
    );

    expect(getByEmail).toHaveBeenCalledTimes(1);
    expect(register).toHaveBeenCalledTimes(1);
    expect(mockNext).toHaveBeenCalledTimes(4);
    expect(mockNext).toHaveBeenCalledWith(error);
  });

  test('Should return HTTP status 204 with no content if register a new student successfully.', async () => {
    mockRequest = {
      body: {
        teacher: 'teacherken@gmail.com',
        students: ['newStudent1@gmail.com'],
      },
    };

    await TEST_INTERCEPTOR.ruleValidation(
      studentRule.forRegister,
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    const getByEmail = jest
      .spyOn(TeacherService.prototype, 'getByEmail')
      .mockResolvedValueOnce({
        status: true,
        data: { teacher_id: 1 } as Teacher,
        message: 'Retrieve teacher successfully.',
      });

    const register = jest
      .spyOn(StudentService.prototype, 'register')
      .mockResolvedValueOnce({
        status: true,
        message: 'Register student successfully.',
      });

    await Promise.resolve(
      StudentController.register(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      )
    );

    expect(getByEmail).toHaveBeenCalledTimes(1);
    expect(register).toHaveBeenCalledTimes(1);
    expect(mockResponse.sendStatus).toHaveBeenCalledWith(
      StatusCodes.NO_CONTENT
    );
  });

  test('Should return HTTP status 204 with no content if register multiple new students successfully.', async () => {
    mockRequest = {
      body: {
        teacher: 'teacherken@gmail.com',
        students: ['newStudent2@gmail.com', 'newStudent3@gmail.com'],
      },
    };

    await TEST_INTERCEPTOR.ruleValidation(
      studentRule.forRegister,
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    const getByEmail = jest
      .spyOn(TeacherService.prototype, 'getByEmail')
      .mockResolvedValueOnce({
        status: true,
        data: { teacher_id: 1 } as Teacher,
        message: 'Retrieve teacher successfully.',
      });

    const register = jest
      .spyOn(StudentService.prototype, 'register')
      .mockResolvedValueOnce({
        status: true,
        message: 'Register student successfully.',
      });

    await Promise.resolve(
      StudentController.register(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      )
    );
    expect(getByEmail).toHaveBeenCalledTimes(1);
    expect(register).toHaveBeenCalledTimes(1);
    expect(mockResponse.sendStatus).toHaveBeenCalledWith(
      StatusCodes.NO_CONTENT
    );
  });
});

describe('Test getCommonStudents controller function', () => {
  test('Should return the list of students common given a teacher', async () => {
    mockRequest = {
      query: {
        teacher: ['teacherken@gmail.com'],
      },
    };

    await TEST_INTERCEPTOR.ruleValidation(
      studentRule.forCommonStudents,
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    const responseData = [
      'commonstudent1@gmail.com',
      'commonstudent2@gmail.com',
      'commonstudent5@gmail.com',
    ];

    const getCommonStudent = jest
      .spyOn(StudentService.prototype, 'getCommonStudent')
      .mockResolvedValueOnce({
        status: true,
        data: responseData as string[],
        message: 'Retrieve common student successfully.',
      });

    await Promise.resolve(
      StudentController.getCommonStudents(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      )
    );
    expect(getCommonStudent).toHaveBeenCalledTimes(1);
    expect(mockResponse.status).toHaveBeenCalledWith(StatusCodes.OK);
    expect(mockResponse.json).toHaveBeenCalledWith({
      students: responseData,
    });
  });

  test('Should return the list of students common given a list of teachers', async () => {
    mockRequest = {
      query: {
        teacher: ['teacherken@gmail.com', 'teacherjoe@gmail.com'],
      },
    };
    const responseData = ['commonstudent2@gmail.com'];

    const getCommonStudent = jest
      .spyOn(StudentService.prototype, 'getCommonStudent')
      .mockResolvedValueOnce({
        status: true,
        data: responseData as string[],
        message: 'Retrieve common student successfully.',
      });

    await Promise.resolve(
      StudentController.getCommonStudents(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      )
    );
    expect(getCommonStudent).toHaveBeenCalledTimes(1);
    expect(mockResponse.status).toHaveBeenCalledWith(StatusCodes.OK);
    expect(mockResponse.json).toHaveBeenCalledWith({ students: responseData });
  });

  test('Should return the zero students', async () => {
    mockRequest = {
      query: {
        teacher: ['none@gmail.com'],
      },
    };
    const responseData: string[] = [];
    const getCommonStudent = jest
      .spyOn(StudentService.prototype, 'getCommonStudent')
      .mockResolvedValueOnce({
        status: true,
        data: responseData as string[],
        message: 'Retrieve common student successfully.',
      });

    await Promise.resolve(
      StudentController.getCommonStudents(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      )
    );
    expect(getCommonStudent).toHaveBeenCalledTimes(1);
    expect(mockResponse.status).toHaveBeenCalledWith(StatusCodes.OK);
    expect(mockResponse.json).toHaveBeenCalledWith({ students: responseData });
  });

  test('Should return error message "Internal Server Error" if get common student occurs server error.', async () => {
    mockRequest = {
      query: {
        teacher: ['teacherken@gmail.com'],
      },
    };
    const error = new Error('Internal Server Error');
    const getCommonStudent = jest
      .spyOn(StudentService.prototype, 'getCommonStudent')
      .mockResolvedValueOnce({
        status: false,
        error: error,
      });

    await Promise.resolve(
      StudentController.getCommonStudents(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      )
    );
    expect(getCommonStudent).toHaveBeenCalledTimes(1);
    expect(mockNext).toHaveBeenCalledTimes(1);
    expect(mockNext).toHaveBeenCalledWith(error);
  });
});

describe('Test suspend controller function', () => {
  test('Should return error message "Student was in suspended status." if suspend a suspended student.', async () => {
    mockRequest = {
      body: {
        student: 'commonstudent5@gmail.com',
      },
    };
    const error = new ErrorBase('Student does not exist.', StatusCodes.OK);
    const suspend = jest
      .spyOn(StudentService.prototype, 'suspend')
      .mockResolvedValueOnce({
        status: false,
        error: error,
      });

    await Promise.resolve(
      StudentController.suspend(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      )
    );
    expect(suspend).toHaveBeenCalledTimes(1);
    expect(mockNext).toHaveBeenCalledTimes(1);
    expect(mockNext).toHaveBeenCalledWith(error);
  });

  test('Should return HTTP status 204 with no content after suspend successfully.', async () => {
    mockRequest = {
      body: {
        student: 'commonstudent4@gmail.com',
      },
    };

    const suspend = jest
      .spyOn(StudentService.prototype, 'suspend')
      .mockResolvedValueOnce({
        status: true,
        message: 'Suspend student successfully.',
      });

    await Promise.resolve(
      StudentController.suspend(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      )
    );
    expect(suspend).toHaveBeenCalledTimes(1);
    expect(mockResponse.sendStatus).toHaveBeenCalledWith(
      StatusCodes.NO_CONTENT
    );
  });

  test('Should return error message "Student does not exist." if the student email does not exist.', async () => {
    mockRequest = {
      body: {
        student: 'none@gmail.com',
      },
    };
    const error = new ErrorBase('Student does not exist.', StatusCodes.OK);
    const suspend = jest
      .spyOn(StudentService.prototype, 'suspend')
      .mockResolvedValueOnce({
        status: false,
        error,
      });

    await Promise.resolve(
      StudentController.suspend(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      )
    );
    expect(suspend).toHaveBeenCalledTimes(1);
    expect(mockNext).toHaveBeenCalledTimes(1);
    expect(mockNext).toHaveBeenCalledWith(error);
  });

  test('Should return error message "Internal Server Error" if suspend student occurs server error.', async () => {
    mockRequest = {
      query: {
        teacher: ['teacherken@gmail.com'],
      },
    };
    const error = new Error('Internal Server Error');
    const suspend = jest
      .spyOn(StudentService.prototype, 'suspend')
      .mockResolvedValueOnce({
        status: false,
        error: error,
      });

    await Promise.resolve(
      StudentController.suspend(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      )
    );
    expect(suspend).toHaveBeenCalledTimes(1);
    expect(mockNext).toHaveBeenCalledTimes(1);
    expect(mockNext).toHaveBeenCalledWith(error);
  });
});

describe('Test getNotificationList controller function', () => {
  test('Should return a list of registered student email only.', async () => {
    mockRequest = {
      body: {
        teacher: 'teacherken@gmail.com',
        notification: 'Hello students',
      },
    };

    await TEST_INTERCEPTOR.ruleValidation(
      studentRule.forRetrieveNotifications,
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    const getByEmail = jest
      .spyOn(TeacherService.prototype, 'getByEmail')
      .mockResolvedValueOnce({
        status: true,
        data: { teacher_id: 1 } as Teacher,
        message: 'Retrieve teacher successfully.',
      });

    const data = ['commonstudent1@gmail.com', 'commonstudent2@gmail.com'];
    const studentNotificationList = jest
      .spyOn(StudentService.prototype, 'getStudentNotificationList')
      .mockResolvedValueOnce({
        status: true,
        data: data,
        message: 'Retrieve student common successfully',
      });

    await Promise.resolve(
      StudentController.getNotificationList(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      )
    );
    expect(getByEmail).toHaveBeenCalledTimes(1);
    expect(studentNotificationList).toHaveBeenCalledTimes(1);
    expect(studentNotificationList).toHaveBeenLastCalledWith(1, []);
    expect(mockResponse.status).toHaveBeenCalledWith(StatusCodes.OK);
    expect(mockResponse.json).toHaveBeenCalledWith({
      recipients: data,
    });
  });

  test('Should return a list of existing email mentioned in notification and student email.', async () => {
    mockRequest = {
      body: {
        teacher: 'teacherken@gmail.com',
        notification:
          'Hello students! @studentagnes@gmail.com @studentmiche@gmail.com',
      },
    };

    await TEST_INTERCEPTOR.ruleValidation(
      studentRule.forRetrieveNotifications,
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    ); // Input Validations

    const getByEmail = jest
      .spyOn(TeacherService.prototype, 'getByEmail')
      .mockResolvedValueOnce({
        status: true,
        data: { teacher_id: 1 } as Teacher,
        message: 'Retrieve teacher successfully.',
      });

    const data = ['commonstudent1@gmail.com', 'commonstudent2@gmail.com'];
    const getStudentNotificationList = jest
      .spyOn(StudentService.prototype, 'getStudentNotificationList')
      .mockResolvedValueOnce({
        status: true,
        data: data,
        message: 'Retrieve student common successfully',
      });

    await Promise.resolve(
      StudentController.getNotificationList(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      )
    );

    expect(getByEmail).toHaveBeenCalledTimes(1);
    expect(getStudentNotificationList).toHaveBeenCalledTimes(1);
    expect(getStudentNotificationList).toHaveBeenLastCalledWith(1, [
      'studentagnes@gmail.com',
      'studentmiche@gmail.com',
    ]);
    expect(mockResponse.status).toHaveBeenCalledWith(StatusCodes.OK);
    expect(mockResponse.json).toHaveBeenCalledWith({
      recipients: data,
    });
  });

  test('Should return a list of existing email mentioned in notification and registered student email without any repetitions.', async () => {
    mockRequest = {
      body: {
        teacher: 'teacherken@gmail.com',
        notification: 'Hello students! @student1@gmail.com @student1@gmail.com',
      },
    };

    await TEST_INTERCEPTOR.ruleValidation(
      studentRule.forRetrieveNotifications,
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    ); // Input Validations

    const getByEmail = jest
      .spyOn(TeacherService.prototype, 'getByEmail')
      .mockResolvedValueOnce({
        status: true,
        data: { teacher_id: 1 } as Teacher,
        message: 'Retrieve teacher successfully.',
      });

    const data = [
      'commonstudent1@gmail.com',
      'commonstudent2@gmail.com',
      'student1@gmail.com',
    ];

    const getStudentNotificationList = jest
      .spyOn(StudentService.prototype, 'getStudentNotificationList')
      .mockResolvedValueOnce({
        status: true,
        data: data,
        message: 'Retrieve student common successfully',
      });

    await Promise.resolve(
      StudentController.getNotificationList(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      )
    );

    expect(getByEmail).toHaveBeenCalledTimes(1);
    expect(getStudentNotificationList).toHaveBeenCalledTimes(1);
    expect(getStudentNotificationList).toHaveBeenLastCalledWith(1, [
      'student1@gmail.com',
    ]);
    expect(mockResponse.status).toHaveBeenCalledWith(StatusCodes.OK);
    expect(mockResponse.json).toHaveBeenCalledWith({
      recipients: data,
    });
  });

  test('Should return zero student email', async () => {
    mockRequest = {
      body: {
        teacher: 'teacherping@gmail.com',
        notification: 'Hello students',
      },
    };

    await TEST_INTERCEPTOR.ruleValidation(
      studentRule.forRetrieveNotifications,
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    ); // Input Validations

    const getByEmail = jest
      .spyOn(TeacherService.prototype, 'getByEmail')
      .mockResolvedValueOnce({
        status: true,
        data: { teacher_id: 1 } as Teacher,
        message: 'Retrieve teacher successfully.',
      });

    const data: string[] = [];

    const getStudentNotificationList = jest
      .spyOn(StudentService.prototype, 'getStudentNotificationList')
      .mockResolvedValueOnce({
        status: true,
        data: data,
        message: 'Retrieve student common successfully',
      });

    await Promise.resolve(
      StudentController.getNotificationList(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      )
    );

    expect(getByEmail).toHaveBeenCalledTimes(1);
    expect(getStudentNotificationList).toHaveBeenCalledTimes(1);
    expect(getStudentNotificationList).toHaveBeenLastCalledWith(1, []);
    expect(mockResponse.status).toHaveBeenCalledWith(StatusCodes.OK);
    expect(mockResponse.json).toHaveBeenCalledWith({
      recipients: data,
    });
  });

  test('Should return message "Teacher does not exist." if the teacher does not exist.', async () => {
    mockRequest = {
      query: {
        teacher: 'teacherken@gmail.com',
        notification: 'Hello students',
      },
    };

    await TEST_INTERCEPTOR.ruleValidation(
      studentRule.forRetrieveNotifications,
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    ); // Input Validations

    const getByEmailError = new ErrorBase(
      'Teacher does not exist.',
      StatusCodes.OK
    );

    const getByEmail = jest
      .spyOn(TeacherService.prototype, 'getByEmail')
      .mockResolvedValueOnce({
        status: false,
        error: getByEmailError,
      });

    const data: string[] = [];

    const getStudentNotificationList = jest
      .spyOn(StudentService.prototype, 'getStudentNotificationList')
      .mockResolvedValueOnce({
        status: true,
        data: data,
        message: 'Retrieve student common successfully',
      });

    await Promise.resolve(
      StudentController.getNotificationList(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      )
    );

    expect(getByEmail).toHaveBeenCalledTimes(1);
    expect(getStudentNotificationList).toHaveBeenCalledTimes(0);
    expect(mockNext).toHaveBeenCalledTimes(3);
    expect(mockNext).toHaveBeenCalledWith(getByEmailError);
  });

  test('Should return error message "Internal Server Error" if retrieve student notification occurs server error.', async () => {
    mockRequest = {
      query: {
        teacher: 'teacherken@gmail.com',
        notification: 'Hello students',
      },
    };

    await TEST_INTERCEPTOR.ruleValidation(
      studentRule.forRetrieveNotifications,
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    ); // Input Validations

    const getByEmail = jest
      .spyOn(TeacherService.prototype, 'getByEmail')
      .mockResolvedValueOnce({
        status: true,
        data: { teacher_id: 1 } as Teacher,
        message: 'Retrieve teacher successfully.',
      });

    const error = new Error('Internal Server Error');
    const getStudentNotificationList = jest
      .spyOn(StudentService.prototype, 'getStudentNotificationList')
      .mockResolvedValueOnce({
        status: false,
        error,
      });

    await Promise.resolve(
      StudentController.getNotificationList(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      )
    );

    expect(getByEmail).toHaveBeenCalledTimes(1);
    expect(getStudentNotificationList).toHaveBeenCalledTimes(1);
    expect(mockNext).toHaveBeenCalledTimes(3);
    expect(mockNext).toHaveBeenCalledWith(error);
  });
});
