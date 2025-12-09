"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EducationqualificationsItem = void 0;
const sequelize_1 = require("./../sequelize");
const sequelize_2 = require("sequelize");
class EducationqualificationsItem extends sequelize_2.Model {
}
exports.EducationqualificationsItem = EducationqualificationsItem;
EducationqualificationsItem.init({
    id: {
        type: sequelize_2.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    EducationqualificationsCategoryId: {
        type: sequelize_2.DataTypes.INTEGER,
        allowNull: false,
    },
    qualificationsName: {
        type: sequelize_2.DataTypes.STRING(300),
        allowNull: false,
    },
}, {
    sequelize: sequelize_1.sequelize,
    modelName: "EducationqualificationsItem",
    tableName: "education_qualifications_item",
    timestamps: false,
});
