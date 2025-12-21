"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PredictionItems = void 0;
const sequelize_1 = require("../sequelize");
const sequelize_2 = require("sequelize");
class PredictionItems extends sequelize_2.Model {
}
exports.PredictionItems = PredictionItems;
PredictionItems.init({
    id: {
        type: sequelize_2.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    predcitonCatId: {
        type: sequelize_2.DataTypes.INTEGER,
        allowNull: false,
    },
    PredictionPlanetId: {
        type: sequelize_2.DataTypes.INTEGER,
        allowNull: false,
    },
    itemName: {
        type: sequelize_2.DataTypes.TEXT,
        allowNull: false,
    },
    feedback: {
        type: sequelize_2.DataTypes.STRING(1),
        allowNull: false,
    }
}, {
    sequelize: sequelize_1.sequelize,
    modelName: "PredictionItems",
    tableName: "prediction_items",
    timestamps: false,
});
