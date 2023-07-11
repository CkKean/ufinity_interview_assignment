import ValidationHandler from '../../utils/validationHandler';
import { check, query } from 'express-validator';

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
          console.log(items)
          let validEmails = true;
          for (const email of items) {
            if (!ValidationHandler.isValidEmailFormat(email)) {
              validEmails = false;
              break;
            }
          }

          return validEmails;
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
