import { Sequelize } from 'sequelize-typescript';
import Logger from './logger';
// import dotenv from 'dotenv';
// dotenv.config();

const LOG = new Logger('database.ts');
interface DatabaseConfiguration {
  DB_HOST: string;
  DB_PORT: string;
  DB_SCHEMA: string;
  DB_USER: string;
  DB_PW: string;
  DB_POOL_ACQUIRE: string;
  DB_POOL_IDLE: string;
  DB_POOL_MAX_CONN: string;
  DB_POOL_MIN_CONN: string;
  DB_LOG_LEVEL: string;
}

const dbConfig: Record<string, DatabaseConfiguration> = {
  development: {
    DB_HOST: process.env.DB_HOST || 'localhost',
    DB_PORT: process.env.DB_PORT || '33306',
    DB_SCHEMA: process.env.DB_SCHEMA || 'teacher-administration-system',
    DB_USER: process.env.DB_USER || 'root',
    DB_PW: process.env.DB_PW || 'password',
    DB_POOL_ACQUIRE: process.env.DB_POOL_ACQUIRE || '30000',
    DB_POOL_IDLE: process.env.DB_POOL_IDLE || '10000',
    DB_POOL_MAX_CONN: process.env.DB_POOL_MAX_CONN || '10',
    DB_POOL_MIN_CONN: process.env.DB_POOL_MIN_CONN || '1',
    DB_LOG_LEVEL: process.env.DB_LOG_LEVEL || 'info',
  },
  test: {
    DB_HOST: process.env.DB_HOST_TEST,
    DB_PORT: process.env.DB_PORT_TEST,
    DB_SCHEMA: process.env.DB_SCHEMA_TEST,
    DB_USER: process.env.DB_USER_TEST,
    DB_PW: process.env.DB_PW_TEST,
    DB_POOL_ACQUIRE: process.env.DB_POOL_ACQUIRE_TEST,
    DB_POOL_IDLE: process.env.DB_POOL_IDLE_TEST,
    DB_POOL_MAX_CONN: process.env.DB_POOL_MAX_CONN_TEST,
    DB_POOL_MIN_CONN: process.env.DB_POOL_MIN_CONN_TEST,
    DB_LOG_LEVEL: process.env.DB_LOG_LEVEL_TEST,
  },
};

// const {
//   DB_HOST = 'localhost',
//   DB_PORT = '33306',
//   DB_SCHEMA = 'teacher-administration-system',
//   DB_USER = 'root',
//   DB_PW = 'password',
//   DB_POOL_ACQUIRE = '30000',
//   DB_POOL_IDLE = '10000',
//   DB_POOL_MAX_CONN = '10',
//   DB_POOL_MIN_CONN = '1',
//   DB_LOG_LEVEL = 'info',
// } = dbConfig[process.env.NODE_ENV || 'development'];

const {
  DB_HOST = 'localhost',
  DB_PORT = '33306',
  DB_SCHEMA = 'teacher-administration-system',
  DB_USER = 'root',
  DB_PW = 'password',
  DB_POOL_ACQUIRE = '30000',
  DB_POOL_IDLE = '10000',
  DB_POOL_MAX_CONN = '10',
  DB_POOL_MIN_CONN = '1',
  DB_LOG_LEVEL = 'info',
} = process.env

const sequelize = new Sequelize(DB_SCHEMA, DB_USER, DB_PW, {
  dialect: 'mysql',
  host: DB_HOST,
  port: parseInt(DB_PORT),
  pool: {
    acquire: parseInt(DB_POOL_ACQUIRE),
    idle: parseInt(DB_POOL_IDLE),
    max: parseInt(DB_POOL_MAX_CONN),
    min: parseInt(DB_POOL_MIN_CONN),
  },
  timezone: '+08:00',
  logging: (msg) => {
    LOG.log(DB_LOG_LEVEL, msg);
  },
});

export default sequelize;
