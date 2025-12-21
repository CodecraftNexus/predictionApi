"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.planetLocatinsPredictins = void 0;
const sequelize_1 = require("../sequelize");
const sequelize_2 = require("sequelize");
class planetLocatinsPredictins extends sequelize_2.Model {
}
exports.planetLocatinsPredictins = planetLocatinsPredictins;
planetLocatinsPredictins.init({
    id: {
        type: sequelize_2.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    lagnaya: {
        type: sequelize_2.DataTypes.STRING(100),
        allowNull: false
    },
    PredictionPlanetId: {
        type: sequelize_2.DataTypes.INTEGER,
        allowNull: false,
    },
    planetlocation: {
        type: sequelize_2.DataTypes.STRING(5),
        allowNull: false
    },
    prediction: {
        type: sequelize_2.DataTypes.TEXT,
        allowNull: false
    }
}, {
    sequelize: sequelize_1.sequelize,
    modelName: "planetLocatinsPredictins",
    tableName: "planet_locatins_predictins",
    timestamps: false,
});
