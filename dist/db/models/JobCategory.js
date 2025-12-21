"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobsCategory = void 0;
const sequelize_1 = require("sequelize");
const sequelize_2 = require("../sequelize");
class JobsCategory extends sequelize_1.Model {
}
exports.JobsCategory = JobsCategory;
JobsCategory.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    CategoryName: {
        type: sequelize_1.DataTypes.STRING(300),
        allowNull: false
    },
}, {
    sequelize: sequelize_2.sequelize,
    modelName: "JobsCategory",
    tableName: "jobs_category",
    timestamps: false,
});
