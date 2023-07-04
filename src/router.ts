import Express from 'express';
import HealthcheckController from './controllers/HealthcheckController';

const router = Express.Router();

router.use('/', HealthcheckController);
router.use('/teachers', HealthcheckController)
router.use('/students', HealthcheckController)
router.use('/notifications', HealthcheckController)

export default router;
