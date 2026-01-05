"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EducationQualificationsCategory = void 0;
const sequelize_1 = require("sequelize");
const sequelize_2 = require("../sequelize");
class EducationQualificationsCategory extends sequelize_1.Model {
}
exports.EducationQualificationsCategory = EducationQualificationsCategory;
EducationQualificationsCategory.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    category_name: {
        type: sequelize_1.DataTypes.STRING(300),
        allowNull: false
    },
}, {
    sequelize: sequelize_2.sequelize,
    modelName: "EducationQualificationsCategory",
    tableName: "education_qualifications_category",
    timestamps: false,
    underscored: true
});
