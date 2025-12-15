"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Jobs = void 0;
const sequelize_1 = require("./../sequelize");
const sequelize_2 = require("sequelize");
class Jobs extends sequelize_2.Model {
}
exports.Jobs = Jobs;
Jobs.init({
    id: {
        type: sequelize_2.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    userId: {
        type: sequelize_2.DataTypes.INTEGER,
        allowNull: false,
    },
    JobItemId: {
        type: sequelize_2.DataTypes.INTEGER,
        allowNull: false,
    },
}, {
    sequelize: sequelize_1.sequelize,
    modelName: "Jobs",
    tableName: "jobs",
    timestamps: false,
});
