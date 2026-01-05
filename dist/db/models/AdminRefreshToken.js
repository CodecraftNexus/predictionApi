"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminRefreshToken = void 0;
const sequelize_1 = require("sequelize");
const sequelize_2 = require("../sequelize");
class AdminRefreshToken extends sequelize_1.Model {
}
exports.AdminRefreshToken = AdminRefreshToken;
AdminRefreshToken.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    admin_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false
    },
    token_hash: {
        type: sequelize_1.DataTypes.STRING(128),
        allowNull: false
    },
    expires_at: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false
    },
    revoked: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
}, {
    sequelize: sequelize_2.sequelize,
    modelName: "AdminRefreshToken",
    tableName: "admin_refresh_tokens",
    timestamps: true,
    paranoid: false,
    underscored: true,
    indexes: [
        { fields: ["admin_id"] },
        { fields: ["token_hash"] }
    ]
});
