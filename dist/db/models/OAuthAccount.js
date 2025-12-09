"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OAuthAccount = void 0;
const sequelize_1 = require("sequelize");
const sequelize_2 = require("../sequelize");
class OAuthAccount extends sequelize_1.Model {
}
exports.OAuthAccount = OAuthAccount;
OAuthAccount.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    userId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    provider: {
        type: sequelize_1.DataTypes.STRING(50),
        allowNull: false,
    },
    providerId: {
        type: sequelize_1.DataTypes.STRING(200),
        allowNull: false,
    },
    metadata: {
        type: sequelize_1.DataTypes.JSON,
        allowNull: true,
    },
}, {
    sequelize: sequelize_2.sequelize,
    modelName: "OAuthAccount",
    tableName: "oauth_accounts",
    timestamps: true,
    paranoid: false,
    underscored: true,
    indexes: [{ unique: true, fields: ["provider", "provider_id"] }, { fields: ["user_id"] }],
});
