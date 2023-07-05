import { RequestHandler } from 'express';
import { StatusCodes } from 'http-status-codes';

export class HealthcheckController {
  healthcheckHandler: RequestHandler = async (req, res) => {
    res.sendStatus(StatusCodes.OK);
  };
}

