import Express from 'express';
import { HealthcheckController } from '../controllers/healthcheckController';

const healthcheckRoute = Express.Router();

healthcheckRoute.get('/', HealthcheckController.healthcheckHandler);

export default healthcheckRoute;
