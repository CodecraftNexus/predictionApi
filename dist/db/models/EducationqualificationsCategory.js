"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EducationqualificationsCatagory = void 0;
const sequelize_1 = require("sequelize");
const sequelize_2 = require("../sequelize");
class EducationqualificationsCatagory extends sequelize_1.Model {
}
exports.EducationqualificationsCatagory = EducationqualificationsCatagory;
EducationqualificationsCatagory.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    CategoryName: {
        type: sequelize_1.DataTypes.STRING(300),
        allowNull: false
    },
}, {
    sequelize: sequelize_2.sequelize,
    modelName: "EducationqualificationsCatagory",
    tableName: "education_qualifications_catagory",
    timestamps: false,
});
