"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashaBalance = void 0;
const sequelize_1 = require("./../sequelize");
const sequelize_2 = require("sequelize");
class DashaBalance extends sequelize_2.Model {
}
exports.DashaBalance = DashaBalance;
DashaBalance.init({
    id: {
        type: sequelize_2.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    userId: {
        type: sequelize_2.DataTypes.INTEGER,
        allowNull: false,
    },
    dashawa: {
        type: sequelize_2.DataTypes.STRING(150),
        allowNull: false,
    },
    From: {
        type: sequelize_2.DataTypes.DATEONLY,
        allowNull: false,
    },
    To: {
        type: sequelize_2.DataTypes.DATEONLY,
        allowNull: false,
    },
}, {
    sequelize: sequelize_1.sequelize,
    modelName: "DashaBalane",
    tableName: "dasha_balance",
    timestamps: false
});
