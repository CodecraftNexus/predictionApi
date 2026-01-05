"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscriptionPackage = void 0;
const sequelize_1 = require("sequelize");
const sequelize_2 = require("../sequelize");
class SubscriptionPackage extends sequelize_1.Model {
}
exports.SubscriptionPackage = SubscriptionPackage;
SubscriptionPackage.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: sequelize_1.DataTypes.STRING(50),
        allowNull: false,
        unique: true,
    },
    description: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: true,
    },
    monthly_price: {
        type: sequelize_1.DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.00,
    },
    yearly_price: {
        type: sequelize_1.DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.00,
    },
    features: {
        type: sequelize_1.DataTypes.JSONB,
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
    modelName: "SubscriptionPackage",
    tableName: "subscription_packages",
    timestamps: true,
});
