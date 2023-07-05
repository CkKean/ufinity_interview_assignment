import { check, query } from 'express-validator';
import ValidationHandler from '../utils/validationHandler';

export const studentRule = {
  forRegister: [
    check('teacher', 'Teacher email is required.')
      .notEmpty()
      .bail()
      .isEmail()
      .withMessage('Invalid teacher email format.'),
    check('students', 'Student email is required.')
      .notEmpty()
      .bail()
      .isArray({ min: 1 }),
    check('students.*', 'Invalid student(s) email format.')
      .notEmpty()
      .bail()
      .isEmail(),
  ],
  forCommonStudents: [
    query('teacher', 'Teacher email is required.')
      .notEmpty()
      .bail()
      .custom((items) => {
        if (Array.isArray(items)) {
          const invalidEmail = items.some((email)=> !ValidationHandler.isValidEmailFormat(email))
          return !invalidEmail;
        } else {
          return ValidationHandler.isValidEmailFormat(items);
        }
      })
      .withMessage('Invalid teacher email format.'),
  ],
  forSuspend: [
    check('student', 'Student email is required.')
      .notEmpty()
      .bail()
      .isEmail()
      .withMessage('Invalid student email format.'),
  ],
  forRetrieveNotifications: [
    check('teacher', 'Teacher email is required.')
      .notEmpty()
      .bail()
      .isEmail()
      .withMessage('Invalid teacher email format.'),
    check('notification', 'Notification is required.')
      .notEmpty()
      .bail()
      .isString(),
  ],
};
