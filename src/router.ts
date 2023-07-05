import Express from 'express';
import HealthCheckRouteInstance from './routes/healthcheckRoute';
import TeacherRoute from './routes/teacherRoute';
import StudentRoute  from './routes/studentRoute';

const router = Express.Router();

router.use('/', StudentRoute.studentRoute);
router.use('/healthCheck', HealthCheckRouteInstance.healthcheckRoute);
router.use('/teachers', TeacherRoute.teacherRoute);

export default router;
