"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminOAuthAccount = void 0;
const sequelize_1 = require("sequelize");
const sequelize_2 = require("../sequelize");
class AdminOAuthAccount extends sequelize_1.Model {
}
exports.AdminOAuthAccount = AdminOAuthAccount;
AdminOAuthAccount.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    admin_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false
    },
    provider: {
        type: sequelize_1.DataTypes.STRING(50),
        allowNull: false
    },
    provider_id: {
        type: sequelize_1.DataTypes.STRING(200),
        allowNull: false
    },
    metadata: {
        type: sequelize_1.DataTypes.JSON,
        allowNull: true
    }
}, {
    sequelize: sequelize_2.sequelize,
    modelName: "AdminOAuthAccount",
    tableName: "admin_oauth_accounts",
    timestamps: true,
    paranoid: false,
    underscored: true,
    indexes: [
        { unique: true, fields: ["provider", "provider_id"] },
        { fields: ["admin_id"] }
    ]
});
