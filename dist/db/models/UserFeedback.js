"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserFeedback = void 0;
const sequelize_1 = require("../sequelize");
const sequelize_2 = require("sequelize");
class UserFeedback extends sequelize_2.Model {
}
exports.UserFeedback = UserFeedback;
UserFeedback.init({
    id: {
        type: sequelize_2.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    PredictionItemId: {
        type: sequelize_2.DataTypes.INTEGER,
        allowNull: false
    },
    userId: {
        type: sequelize_2.DataTypes.INTEGER,
        allowNull: false
    }
}, {
    sequelize: sequelize_1.sequelize,
    modelName: "UserFeedback",
    tableName: "user_feedback",
    timestamps: false,
});
