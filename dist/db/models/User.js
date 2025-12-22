"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const sequelize_1 = require("sequelize");
const sequelize_2 = require("../sequelize");
class User extends sequelize_1.Model {
}
exports.User = User;
User.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: sequelize_1.DataTypes.STRING(150),
        allowNull: false
    },
    email: {
        type: sequelize_1.DataTypes.STRING(254),
        allowNull: true,
        unique: true,
        validate: {
            isEmail: true
        }
    },
    dateOfBirth: {
        type: sequelize_1.DataTypes.DATEONLY,
        allowNull: true,
    },
    birthTime: {
        type: sequelize_1.DataTypes.TIME,
        allowNull: true,
    },
    genderId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    birth_location_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    username: {
        type: sequelize_1.DataTypes.STRING(50),
        allowNull: true,
    },
    WhatsappNumber: {
        type: sequelize_1.DataTypes.STRING(12),
        allowNull: true,
    },
    hashPassword: {
        type: sequelize_1.DataTypes.STRING(250),
        allowNull: true,
    },
    reference: {
        type: sequelize_1.DataTypes.STRING(100),
        allowNull: true,
    },
    nikname: {
        type: sequelize_1.DataTypes.STRING(100),
        allowNull: true,
    },
    createdAt: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize_2.sequelize.literal('CURRENT_TIMESTAMP'),
    },
    updatedAt: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize_2.sequelize.literal('CURRENT_TIMESTAMP'),
    },
}, {
    sequelize: sequelize_2.sequelize,
    modelName: "User",
    tableName: "users",
    timestamps: true,
});
