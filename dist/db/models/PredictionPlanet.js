"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PredictionPlanet = void 0;
const sequelize_1 = require("../sequelize");
const sequelize_2 = require("sequelize");
class PredictionPlanet extends sequelize_2.Model {
}
exports.PredictionPlanet = PredictionPlanet;
PredictionPlanet.init({
    id: {
        type: sequelize_2.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    planet_name: {
        type: sequelize_2.DataTypes.STRING(100),
        allowNull: false,
        unique: true
    }
}, {
    sequelize: sequelize_1.sequelize,
    modelName: "PredictionPlanet",
    tableName: "prediction_planet",
    underscored: true,
    timestamps: false,
});
