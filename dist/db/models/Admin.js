"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Admin = void 0;
const sequelize_1 = require("sequelize");
const sequelize_2 = require("../sequelize");
class Admin extends sequelize_1.Model {
}
exports.Admin = Admin;
Admin.init({
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
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        }
    },
}, {
    sequelize: sequelize_2.sequelize,
    modelName: "Admin",
    tableName: "admins",
    timestamps: false
});
