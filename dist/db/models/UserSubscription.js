"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserSubscription = void 0;
const sequelize_1 = require("sequelize");
const sequelize_2 = require("../sequelize");
class UserSubscription extends sequelize_1.Model {
}
exports.UserSubscription = UserSubscription;
UserSubscription.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    user_id: {
        type: sequelize_1.DataTypes.STRING(100),
        allowNull: false,
    },
    package_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    duration: {
        type: sequelize_1.DataTypes.ENUM('monthly', 'yearly'),
        allowNull: true,
    },
    start_date: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize_1.DataTypes.NOW,
    },
    end_date: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: true,
    },
    status: {
        type: sequelize_1.DataTypes.ENUM('active', 'expired', 'cancelled'),
        allowNull: false,
        defaultValue: 'active',
    },
    payment_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true,
    },
    created_at: {
        type: sequelize_1.DataTypes.DATE,
        defaultValue: sequelize_1.DataTypes.NOW,
    },
    updated_at: {
        type: sequelize_1.DataTypes.DATE,
        defaultValue: sequelize_1.DataTypes.NOW,
    },
}, {
    sequelize: sequelize_2.sequelize,
    modelName: "UserSubscription",
    tableName: "user_subscriptions",
    timestamps: true,
});
