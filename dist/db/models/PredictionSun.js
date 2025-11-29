"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sunPrediction = void 0;
const sequelize_1 = require("../sequelize");
const sequelize_2 = require("sequelize");
class sunPrediction extends sequelize_2.Model {
}
exports.sunPrediction = sunPrediction;
sunPrediction.init({
    id: {
        type: sequelize_2.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    userId: {
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
    modelName: "PredictionSun",
    tableName: "Prediction_sun",
    timestamps: false,
});
