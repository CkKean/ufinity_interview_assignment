import Express, { NextFunction, RequestHandler } from "express";

const TeacherController = Express.Router();

const create: RequestHandler = async (req, res, next: NextFunction) => {
  try {

    


  } catch (error) {
    next(error);
  }
};

TeacherController.post("/register", create);

export default TeacherController;
