"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LifeTimePredictions = void 0;
const sequelize_1 = require("../sequelize");
const sequelize_2 = require("sequelize");
class LifeTimePredictions extends sequelize_2.Model {
}
exports.LifeTimePredictions = LifeTimePredictions;
LifeTimePredictions.init({
    id: {
        type: sequelize_2.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    user_id: {
        type: sequelize_2.DataTypes.STRING(100),
        allowNull: false,
    },
    life_time_prediction_category_id: {
        type: sequelize_2.DataTypes.INTEGER,
        allowNull: false,
    },
    prediction_planet_id: {
        type: sequelize_2.DataTypes.INTEGER,
        allowNull: false,
    },
    predciton: {
        type: sequelize_2.DataTypes.TEXT,
        allowNull: false,
    }
}, {
    sequelize: sequelize_1.sequelize,
    modelName: "LifeTimePredictions",
    tableName: "life_time_predictions",
    underscored: true,
    timestamps: false,
    indexes: [{ fields: [" life_time_prediction_category_id"] }, { fields: ["user_id"] }, { fields: ["prediction_planet_id"] }]
});
