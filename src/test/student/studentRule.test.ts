import errorHandler from '../../middlewares/ruleErrorHandler';
import { studentRule } from '../../middlewares/rules/studentRule';
import { TEST_INTERCEPTOR } from '../../utils/testHelper';
import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

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

describe('Test /api/register input validation', () => {
  test('Should return an error message "Invalid teacher email format." if the teacher email format is invalid.', async () => {
    mockRequest = {
      body: {
        teacher: 'teacherhon',
        students: ['studentjon1@gmail.com', 'studentjohn@gmail.com'],
      },
    };
    await TEST_INTERCEPTOR.ruleValidation(
      studentRule.forRegister,
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    ); // Input Validations
    expect(mockNext).toBeCalledTimes(3); // Passed 3 input validations
    errorHandler(mockRequest as Request, mockResponse as Response, mockNext); // Error Handler Middleware
    expect(mockNext).toBeCalledTimes(3); // Passed 3 validations but can't pass error handler
    expect(mockResponse.status).toHaveBeenCalledWith(StatusCodes.BAD_REQUEST); // Status code
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: 'Invalid teacher email format.',
    });
  });

  test('Should return an error message "Teacher email is required." if the teacher input is empty.', async () => {
    mockRequest = {
      body: {
        teacher: '',
        students: ['studentjon1@gmail.com', 'studentjohn@gmail.com'],
      },
    };
    await TEST_INTERCEPTOR.ruleValidation(
      studentRule.forRegister,
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    ); // Input Validations
    expect(mockNext).toBeCalledTimes(3); // Passed 3 input validations
    errorHandler(mockRequest as Request, mockResponse as Response, mockNext); // Error Handler Middleware
    expect(mockNext).toBeCalledTimes(3); // Passed 3 validations but can't pass error handler
    expect(mockResponse.status).toHaveBeenCalledWith(StatusCodes.BAD_REQUEST);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: 'Teacher email is required.',
    });
  });

  test('Should return an error message "Teacher email is required." if the teacher input is not provided.', async () => {
    mockRequest = {
      body: {
        students: ['studentjon1@gmail.com', 'studentjohn@gmail.com'],
      },
    };
    await TEST_INTERCEPTOR.ruleValidation(
      studentRule.forRegister,
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    ); // Input Validations
    expect(mockNext).toBeCalledTimes(3); // Passed 3 input validations
    errorHandler(mockRequest as Request, mockResponse as Response, mockNext); // Error Handler Middleware
    expect(mockNext).toBeCalledTimes(3); // Passed 3 validations but can't pass error handler
    expect(mockResponse.status).toHaveBeenCalledWith(StatusCodes.BAD_REQUEST);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: 'Teacher email is required.',
    });
  });

  test('Should return error message "Student email is required." if 0 student input.', async () => {
    mockRequest = {
      body: {
        teacher: 'teacherhon3@gmail.com',
        students: [],
      },
    };
    await TEST_INTERCEPTOR.ruleValidation(
      studentRule.forRegister,
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    ); // Input Validations
    expect(mockNext).toBeCalledTimes(3); // Passed 3 input validations
    errorHandler(mockRequest as Request, mockResponse as Response, mockNext); // Error Handler Middleware
    expect(mockNext).toBeCalledTimes(3); // Passed 3 validations but can't pass error handler
    expect(mockResponse.status).toHaveBeenCalledWith(StatusCodes.BAD_REQUEST);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: 'Student email is required.',
    });
  });

  test('Should return error message "Student email is required." if students input is not provided.', async () => {
    mockRequest = {
      body: {
        teacher: 'teacherhon3@gmail.com',
      },
    };
    await TEST_INTERCEPTOR.ruleValidation(
      studentRule.forRegister,
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    ); // Input Validations
    expect(mockNext).toBeCalledTimes(3); // Passed 3 input validations
    errorHandler(mockRequest as Request, mockResponse as Response, mockNext); // Error Handler Middleware
    expect(mockNext).toBeCalledTimes(3); // Passed 3 validations but can't pass error handler
    expect(mockResponse.status).toHaveBeenCalledWith(StatusCodes.BAD_REQUEST);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: 'Student email is required.',
    });
  });

  test('Should return error message "Invalid student(s) email format." if student email format is invalid.', async () => {
    mockRequest = {
      body: {
        teacher: 'teacherhon3@gmail.com',
        students: ['studentjon1', 'studentjohn'],
      },
    };
    await TEST_INTERCEPTOR.ruleValidation(
      studentRule.forRegister,
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    ); // Input Validations
    expect(mockNext).toBeCalledTimes(3); // Passed 3 input validations
    errorHandler(mockRequest as Request, mockResponse as Response, mockNext); // Error Handler Middleware
    expect(mockNext).toBeCalledTimes(3); // Passed 3 validations but can't pass error handler
    expect(mockResponse.status).toHaveBeenCalledWith(StatusCodes.BAD_REQUEST);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: 'Invalid student(s) email format.',
    });
  });
});

describe('Test /api/commonstudents input validation', () => {
  test('Should return error message "Teacher email is required." if teacher parameter input is not provided.', async () => {
    mockRequest = {
      query: {},
    };
    await TEST_INTERCEPTOR.ruleValidation(
      studentRule.forCommonStudents,
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    ); // Input Validations
    expect(mockNext).toBeCalledTimes(1); // Passed 3 input validations
    errorHandler(mockRequest as Request, mockResponse as Response, mockNext); // Error Handler Middleware
    expect(mockNext).toBeCalledTimes(1); // Passed 3 validations but can't pass error handler
    expect(mockResponse.status).toHaveBeenCalledWith(StatusCodes.BAD_REQUEST); // Status code
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: 'Teacher email is required.',
    });
  });

  test('Should return error message "Teacher email is required." if teacher input is empty string.', async () => {
    mockRequest = {
      query: {
        teacher: '',
      },
    };
    await TEST_INTERCEPTOR.ruleValidation(
      studentRule.forCommonStudents,
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    ); // Input Validations
    expect(mockNext).toBeCalledTimes(1); // Passed 3 input validations
    errorHandler(mockRequest as Request, mockResponse as Response, mockNext); // Error Handler Middleware
    expect(mockNext).toBeCalledTimes(1); // Passed 3 validations but can't pass error handler
    expect(mockResponse.status).toHaveBeenCalledWith(StatusCodes.BAD_REQUEST); // Status code
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: 'Teacher email is required.',
    });
  });

  test('Should return error message "Invalid teacher email format." if teacher email format is invalid.', async () => {
    mockRequest = {
      query: {
        teacher: ['teacherkencom', 'teacherkangcom'],
      },
    };
    await TEST_INTERCEPTOR.ruleValidation(
      studentRule.forCommonStudents,
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    ); // Input Validations
    expect(mockNext).toBeCalledTimes(1); // Passed 3 input validations
    errorHandler(mockRequest as Request, mockResponse as Response, mockNext); // Error Handler Middleware
    expect(mockNext).toBeCalledTimes(1); // Passed 3 validations but can't pass error handler
    expect(mockResponse.status).toHaveBeenCalledWith(StatusCodes.BAD_REQUEST); // Status code
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: 'Invalid teacher email format.',
    });
  });
});

describe('Test /api/commonstudents input validation', () => {
  test('Should return error message "Teacher email is required." if teacher parameter input is not provided.', async () => {
    mockRequest = {
      query: {},
    };
    await TEST_INTERCEPTOR.ruleValidation(
      studentRule.forCommonStudents,
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    ); // Input Validations
    expect(mockNext).toBeCalledTimes(1); // Passed 3 input validations
    errorHandler(mockRequest as Request, mockResponse as Response, mockNext); // Error Handler Middleware
    expect(mockNext).toBeCalledTimes(1); // Passed 3 validations but can't pass error handler
    expect(mockResponse.status).toHaveBeenCalledWith(StatusCodes.BAD_REQUEST); // Status code
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: 'Teacher email is required.',
    });
  });

  test('Should return error message "Teacher email is required." if teacher input is empty string.', async () => {
    mockRequest = {
      query: {
        teacher: '',
      },
    };
    await TEST_INTERCEPTOR.ruleValidation(
      studentRule.forCommonStudents,
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    ); // Input Validations
    expect(mockNext).toBeCalledTimes(1); // Passed 3 input validations
    errorHandler(mockRequest as Request, mockResponse as Response, mockNext); // Error Handler Middleware
    expect(mockNext).toBeCalledTimes(1); // Passed 3 validations but can't pass error handler
    expect(mockResponse.status).toHaveBeenCalledWith(StatusCodes.BAD_REQUEST); // Status code
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: 'Teacher email is required.',
    });
  });

  test('Should return error message "Invalid teacher email format." if teacher email format is invalid.', async () => {
    mockRequest = {
      query: {
        teacher: ['teacherkencom', 'teacherkangcom'],
      },
    };
    await TEST_INTERCEPTOR.ruleValidation(
      studentRule.forCommonStudents,
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    ); // Input Validations
    expect(mockNext).toBeCalledTimes(1); // Passed 3 input validations
    errorHandler(mockRequest as Request, mockResponse as Response, mockNext); // Error Handler Middleware
    expect(mockNext).toBeCalledTimes(1); // Passed 3 validations but can't pass error handler
    expect(mockResponse.status).toHaveBeenCalledWith(StatusCodes.BAD_REQUEST); // Status code
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: 'Invalid teacher email format.',
    });
  });
});

describe('Test /api/suspend input validation', () => {
  test('Should return an error message "Invalid student email format." if student email format is invalid.', async () => {
    mockRequest = {
      body: {
        student: 'commonstudent4',
      },
    };
    await TEST_INTERCEPTOR.ruleValidation(
      studentRule.forSuspend,
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    ); // Input Validations
    expect(mockNext).toBeCalledTimes(1); // Passed 3 input validations
    errorHandler(mockRequest as Request, mockResponse as Response, mockNext); // Error Handler Middleware
    expect(mockNext).toBeCalledTimes(1); // Passed 3 validations but can't pass error handler
    expect(mockResponse.status).toHaveBeenCalledWith(StatusCodes.BAD_REQUEST); // Status code
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: 'Invalid student email format.',
    });
  });

  test('Should return an error message "Student email is required." if student email is empty string.', async () => {
    mockRequest = {
      body: {
        student: '',
      },
    };
    await TEST_INTERCEPTOR.ruleValidation(
      studentRule.forSuspend,
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    ); // Input Validations
    expect(mockNext).toBeCalledTimes(1); // Passed 3 input validations
    errorHandler(mockRequest as Request, mockResponse as Response, mockNext); // Error Handler Middleware
    expect(mockNext).toBeCalledTimes(1); // Passed 3 validations but can't pass error handler
    expect(mockResponse.status).toHaveBeenCalledWith(StatusCodes.BAD_REQUEST); // Status code
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: 'Student email is required.',
    });
  });

  test('Should return an error message "Student email is required." if student email input is not provided.', async () => {
    mockRequest = {
      body: {},
    };
    await TEST_INTERCEPTOR.ruleValidation(
      studentRule.forSuspend,
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    ); // Input Validations
    expect(mockNext).toBeCalledTimes(1); // Passed 3 input validations
    errorHandler(mockRequest as Request, mockResponse as Response, mockNext); // Error Handler Middleware
    expect(mockNext).toBeCalledTimes(1); // Passed 3 validations but can't pass error handler
    expect(mockResponse.status).toHaveBeenCalledWith(StatusCodes.BAD_REQUEST); // Status code
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: 'Student email is required.',
    });
  });
});

describe('POST /api/retrievefornotifications', () => {
  test('Should return error message "Invalid teacher email format." if teacher email format is invalid.', async () => {
    mockRequest = {
      body: {
        teacher: 'teacher@',
        notification: 'Hello students!',
      },
    };
    await TEST_INTERCEPTOR.ruleValidation(
      studentRule.forRetrieveNotifications,
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    ); // Input Validations
    expect(mockNext).toBeCalledTimes(2); // Passed 3 input validations
    errorHandler(mockRequest as Request, mockResponse as Response, mockNext); // Error Handler Middleware
    expect(mockNext).toBeCalledTimes(2); // Passed 3 validations but can't pass error handler
    expect(mockResponse.status).toHaveBeenCalledWith(StatusCodes.BAD_REQUEST); // Status code
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: 'Invalid teacher email format.',
    });
  });

  test('Should return error message "Teacher email is required." if teacher email is empty string.', async () => {
    mockRequest = {
      body: {
        teacher: '',
        notification: 'Hello students!',
      },
    };
    await TEST_INTERCEPTOR.ruleValidation(
      studentRule.forRetrieveNotifications,
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    ); // Input Validations
    expect(mockNext).toBeCalledTimes(2); // Passed 3 input validations
    errorHandler(mockRequest as Request, mockResponse as Response, mockNext); // Error Handler Middleware
    expect(mockNext).toBeCalledTimes(2); // Passed 3 validations but can't pass error handler
    expect(mockResponse.status).toHaveBeenCalledWith(StatusCodes.BAD_REQUEST); // Status code
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: 'Teacher email is required.',
    });
  });

  test('Should return error message "Teacher email is required." if teacher email input is not provided.', async () => {
    mockRequest = {
      body: { notification: 'Hello students!' },
    };
    await TEST_INTERCEPTOR.ruleValidation(
      studentRule.forRetrieveNotifications,
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    ); // Input Validations
    expect(mockNext).toBeCalledTimes(2); // Passed 3 input validations
    errorHandler(mockRequest as Request, mockResponse as Response, mockNext); // Error Handler Middleware
    expect(mockNext).toBeCalledTimes(2); // Passed 3 validations but can't pass error handler
    expect(mockResponse.status).toHaveBeenCalledWith(StatusCodes.BAD_REQUEST); // Status code
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: 'Teacher email is required.',
    });
  });

  test('Should return error message "Notification is required." if notification is empty string', async () => {
    mockRequest = {
      body: {
        teacher: 'teacherken@gmail.com',
        notification: '',
      },
    };
    await TEST_INTERCEPTOR.ruleValidation(
      studentRule.forRetrieveNotifications,
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    ); // Input Validations
    expect(mockNext).toBeCalledTimes(2); // Passed 3 input validations
    errorHandler(mockRequest as Request, mockResponse as Response, mockNext); // Error Handler Middleware
    expect(mockNext).toBeCalledTimes(2); // Passed 3 validations but can't pass error handler
    expect(mockResponse.status).toHaveBeenCalledWith(StatusCodes.BAD_REQUEST); // Status code
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: 'Notification is required.',
    });
  });
  
  test('Should return error message "Notification is required." if notification input is not provided.', async () => {
    mockRequest = {
      body: {
        teacher: 'teacherken@gmail.com',
      },
    };
    await TEST_INTERCEPTOR.ruleValidation(
      studentRule.forRetrieveNotifications,
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    ); // Input Validations
    expect(mockNext).toBeCalledTimes(2); // Passed 3 input validations
    errorHandler(mockRequest as Request, mockResponse as Response, mockNext); // Error Handler Middleware
    expect(mockNext).toBeCalledTimes(2); // Passed 3 validations but can't pass error handler
    expect(mockResponse.status).toHaveBeenCalledWith(StatusCodes.BAD_REQUEST); // Status code
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: 'Notification is required.',
    });
  });
});
