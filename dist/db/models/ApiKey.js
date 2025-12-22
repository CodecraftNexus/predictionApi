"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiKey = void 0;
const sequelize_1 = require("./../sequelize");
const sequelize_2 = require("sequelize");
class ApiKey extends sequelize_2.Model {
}
exports.ApiKey = ApiKey;
ApiKey.init({
    id: {
        type: sequelize_2.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    key: {
        type: sequelize_2.DataTypes.STRING(250),
        allowNull: false
    }
}, {
    sequelize: sequelize_1.sequelize,
    modelName: "ApiKey",
    tableName: "api_key",
    timestamps: false,
});
