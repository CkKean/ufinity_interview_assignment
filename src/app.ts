import compression from 'compression';
import cors from 'cors';
import Express from 'express';
import globalErrorHandler from './config/globalErrorHandler';
import router from './router';

const App = Express();

App.use(compression());
App.use(cors());
App.use(Express.json());
App.use(Express.urlencoded({ extended: true }));
App.use('/api',  router);
App.use(globalErrorHandler);

export default App;
