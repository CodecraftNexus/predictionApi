"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Educationqualifications = void 0;
const sequelize_1 = require("./../sequelize");
const sequelize_2 = require("sequelize");
class Educationqualifications extends sequelize_2.Model {
}
exports.Educationqualifications = Educationqualifications;
Educationqualifications.init({
    id: {
        type: sequelize_2.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    userId: {
        type: sequelize_2.DataTypes.INTEGER,
        allowNull: false,
    },
    EducationqualificationsItemId: {
        type: sequelize_2.DataTypes.INTEGER,
        allowNull: false,
    },
}, {
    sequelize: sequelize_1.sequelize,
    modelName: "Educationqualifications",
    tableName: "education_qualifications",
    timestamps: false,
});
