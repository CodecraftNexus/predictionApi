import { Sequelize } from 'sequelize';
import { env } from '../config/env';

export const sequelize = new Sequelize({
  database: env.DB_NAME,
  username : env.DB_USER,
  password :env.DB_PASSWORD,
  host : env.DB_HOST,
  port : env.DB_PORT,
  dialect : "mysql",
  logging : false,
  timezone : env.TIMEZONE,
})


