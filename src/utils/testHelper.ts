import { NextFunction, Request, Response } from 'express';
import { ValidationChain } from 'express-validator';

export const TEST_INTERCEPTOR = {
  mockRequest: () => {
    const req: any = {};
    req.body = jest.fn().mockReturnValue(req); // jest.fn() creates mock function, mockReturnvalue will always return the req object itself (Useful for simulating method chaining).
    req.params = jest.fn().mockReturnValue(req);
    return req;
  },
  mockResponse: () => {
    const res: any = {};
    res.send = jest.fn().mockReturnValue(res);
    res.sendStatus = jest.fn().mockReturnValue(res);
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
  },
  mockNext: () => jest.fn(),
  ruleValidation: (
    rules: ValidationChain[],
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    return Promise.all(rules.map((validation) => validation(req, res, next)));
  },
};
