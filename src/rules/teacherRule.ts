import { check } from "express-validator";

export const teacherRule = {
  forCreate: [
    check("teacher_email", "Teacher email is required.")
      .notEmpty()
      .bail()
      .isEmail()
      .withMessage("Invalid teacher email format."),
  ],
};
