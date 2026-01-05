"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PredictionTranslation = void 0;
const sequelize_1 = require("../sequelize");
const sequelize_2 = require("sequelize");
class PredictionTranslation extends sequelize_2.Model {
}
exports.PredictionTranslation = PredictionTranslation;
PredictionTranslation.init({
    id: {
        type: sequelize_2.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    language: {
        type: sequelize_2.DataTypes.ENUM('si', 'ta'),
        allowNull: false,
    },
    translated_text: {
        type: sequelize_2.DataTypes.TEXT,
        allowNull: false,
    },
    original_text: {
        type: sequelize_2.DataTypes.TEXT,
        allowNull: false
    }
}, {
    sequelize: sequelize_1.sequelize,
    modelName: "PredictionTranslation",
    tableName: "prediction_translations",
    underscored: true,
    timestamps: false,
});
