import { RequestHandler } from "express";
import { StatusCodes } from "http-status-codes";

const healthcheckHandler: RequestHandler = async (req, res) => {
  return res.sendStatus(StatusCodes.OK);
};

export const HealthcheckController = {
  healthcheckHandler,
};
