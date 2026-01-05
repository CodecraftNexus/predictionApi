"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserFeedbackQuestion = void 0;
const sequelize_1 = require("sequelize");
const sequelize_2 = require("../sequelize");
class UserFeedbackQuestion extends sequelize_1.Model {
}
exports.UserFeedbackQuestion = UserFeedbackQuestion;
UserFeedbackQuestion.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    question_key: {
        type: sequelize_1.DataTypes.STRING(100),
        allowNull: false,
        unique: true,
    },
    question_text_si: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: false,
    },
    question_text_en: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: true,
    },
    question_text_ta: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: true,
    },
    question_type: {
        type: sequelize_1.DataTypes.ENUM('yes_no', 'text', 'number', 'date', 'year', 'select', 'color', 'multi_select'),
        allowNull: false,
    },
    options: {
        type: sequelize_1.DataTypes.JSONB,
        allowNull: true,
    },
    parent_question_key: {
        type: sequelize_1.DataTypes.STRING(100),
        allowNull: true,
    },
    parent_answer_condition: {
        type: sequelize_1.DataTypes.STRING(50),
        allowNull: true,
    },
    display_order: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
    category: {
        type: sequelize_1.DataTypes.STRING(100),
        allowNull: true,
    },
    is_active: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
    },
    created_at: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize_2.sequelize.literal('CURRENT_TIMESTAMP'),
    },
    updated_at: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize_2.sequelize.literal('CURRENT_TIMESTAMP'),
    },
}, {
    sequelize: sequelize_2.sequelize,
    modelName: "UserFeedbackQuestion",
    tableName: "user_feedback_questions",
    timestamps: true,
    underscored: true,
});
