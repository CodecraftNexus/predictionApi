"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PredictionFeedback = void 0;
const sequelize_1 = require("sequelize");
const sequelize_2 = require("../sequelize");
class PredictionFeedback extends sequelize_1.Model {
}
exports.PredictionFeedback = PredictionFeedback;
PredictionFeedback.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    user_id: {
        type: sequelize_1.DataTypes.STRING(100),
        allowNull: false,
    },
    prediction_planet_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    life_time_prediction_category_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    prediction_text: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: false,
    },
    feedback_type: {
        type: sequelize_1.DataTypes.ENUM('correct', 'incorrect', 'undecided'),
        allowNull: false,
    },
    created_at: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize_1.DataTypes.NOW,
    },
    updated_at: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize_1.DataTypes.NOW,
    },
}, {
    sequelize: sequelize_2.sequelize,
    modelName: "PredictionFeedback",
    tableName: "prediction_feedbacks",
    timestamps: true,
    underscored: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    indexes: [
        {
            fields: ['user_id'],
            name: 'idx_feedback_user'
        },
        {
            fields: ['prediction_planet_id'],
            name: 'idx_feedback_planet'
        },
        {
            fields: ['life_time_prediction_category_id'],
            name: 'idx_feedback_category'
        }
    ]
});
