"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Predictions = void 0;
const sequelize_1 = require("../sequelize");
const sequelize_2 = require("sequelize");
class Predictions extends sequelize_2.Model {
}
exports.Predictions = Predictions;
Predictions.init({
    id: {
        type: sequelize_2.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    userId: {
        type: sequelize_2.DataTypes.INTEGER,
        allowNull: false,
    },
    PredictionPlanetId: {
        type: sequelize_2.DataTypes.INTEGER,
        allowNull: false,
    },
    general_prediction: {
        type: sequelize_2.DataTypes.TEXT,
        allowNull: false
    },
    personalised_prediction: {
        type: sequelize_2.DataTypes.TEXT,
        allowNull: false
    },
    planet_zodiac_prediction: {
        type: sequelize_2.DataTypes.TEXT,
        allowNull: false
    },
    verbal_location: {
        type: sequelize_2.DataTypes.STRING(250),
        allowNull: false
    }
}, {
    sequelize: sequelize_1.sequelize,
    modelName: "Predictions",
    tableName: "Predictions",
    timestamps: false,
});
