"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sequelize = void 0;
const sequelize_1 = require("sequelize");
const env_1 = require("../config/env");
exports.sequelize = new sequelize_1.Sequelize({
    database: env_1.env.DB_NAME,
    username: env_1.env.DB_USER,
    password: env_1.env.DB_PASSWORD,
    host: env_1.env.DB_HOST,
    port: env_1.env.DB_PORT,
    dialect: "mysql",
    logging: false,
    timezone: env_1.env.TIMEZONE,
});
