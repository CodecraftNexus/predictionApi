"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Predictioncategory = void 0;
const sequelize_1 = require("../sequelize");
const sequelize_2 = require("sequelize");
class Predictioncategory extends sequelize_2.Model {
}
exports.Predictioncategory = Predictioncategory;
Predictioncategory.init({
    id: {
        type: sequelize_2.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: sequelize_2.DataTypes.STRING(100),
        allowNull: false,
    },
}, {
    sequelize: sequelize_1.sequelize,
    modelName: "Predictioncategory",
    tableName: "prediction_category",
    timestamps: false,
});
