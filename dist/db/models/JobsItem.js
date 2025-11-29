"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobsItem = void 0;
const sequelize_1 = require("./../sequelize");
const sequelize_2 = require("sequelize");
class JobsItem extends sequelize_2.Model {
}
exports.JobsItem = JobsItem;
JobsItem.init({
    id: {
        type: sequelize_2.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    JobCategoryId: {
        type: sequelize_2.DataTypes.INTEGER,
        allowNull: false,
    },
    JobsName: {
        type: sequelize_2.DataTypes.STRING(300),
        allowNull: false,
    },
}, {
    sequelize: sequelize_1.sequelize,
    modelName: "JobsItem",
    tableName: "jobs_item",
    timestamps: false,
});
