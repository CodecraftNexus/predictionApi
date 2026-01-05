"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserFeedbackAnswer = void 0;
const sequelize_1 = require("sequelize");
const sequelize_2 = require("../sequelize");
class UserFeedbackAnswer extends sequelize_1.Model {
}
exports.UserFeedbackAnswer = UserFeedbackAnswer;
UserFeedbackAnswer.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    user_id: {
        type: sequelize_1.DataTypes.STRING(100),
        allowNull: false,
    },
    question_key: {
        type: sequelize_1.DataTypes.STRING(100),
        allowNull: false,
    },
    answer_text: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: true,
    },
    answer_number: {
        type: sequelize_1.DataTypes.DOUBLE,
        allowNull: true,
    },
    answer_date: {
        type: sequelize_1.DataTypes.DATEONLY,
        allowNull: true,
    },
    answer_json: {
        type: sequelize_1.DataTypes.JSONB,
        allowNull: true,
    },
    created_at: {
        type: sequelize_1.DataTypes.DATE,
        defaultValue: sequelize_2.sequelize.literal('CURRENT_TIMESTAMP'),
    },
    updated_at: {
        type: sequelize_1.DataTypes.DATE,
        defaultValue: sequelize_2.sequelize.literal('CURRENT_TIMESTAMP'),
    },
}, {
    sequelize: sequelize_2.sequelize,
    modelName: "UserFeedbackAnswer",
    tableName: "user_feedback_answers",
    timestamps: true,
    underscored: true,
});
