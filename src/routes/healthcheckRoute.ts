import Express from 'express';
import { HealthcheckController } from '../controllers/healthcheckController';

class HealthCheckRoute {
  healthcheckRoute = Express.Router();
  
  private healthcheckController = new HealthcheckController();

  constructor() {
    this.healthcheckRoute.get(
      '/',
      this.healthcheckController.healthcheckHandler
    );
  }
}

export default new HealthCheckRoute();
