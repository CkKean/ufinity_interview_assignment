import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { StatusCodes } from 'http-status-codes';

const errorHandler = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req).array()[0];
  if (errors) {
   return res.status(StatusCodes.BAD_REQUEST).json({
      message: errors.msg,
    });
  }
  
  next();
};

export default errorHandler;
