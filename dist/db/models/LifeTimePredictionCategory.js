"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LifeTimePredictionCategory = void 0;
const sequelize_1 = require("./../sequelize");
const sequelize_2 = require("sequelize");
class LifeTimePredictionCategory extends sequelize_2.Model {
}
exports.LifeTimePredictionCategory = LifeTimePredictionCategory;
LifeTimePredictionCategory.init({
    id: {
        type: sequelize_2.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: sequelize_2.DataTypes.STRING(200),
        allowNull: false
    }
}, {
    sequelize: sequelize_1.sequelize,
    modelName: "LifeTimePredictionCategory",
    tableName: "life_time_prediction_category",
    timestamps: false,
    underscored: true
});
