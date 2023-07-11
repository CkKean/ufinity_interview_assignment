import { HealthcheckController } from '../controllers/healthcheckController';
import Express from 'express';

const healthcheckRoute = Express.Router();

healthcheckRoute.get('/', HealthcheckController.healthcheckHandler);

export default healthcheckRoute;
