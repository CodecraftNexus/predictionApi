"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EducationQualificationsItem = void 0;
const sequelize_1 = require("../sequelize");
const sequelize_2 = require("sequelize");
class EducationQualificationsItem extends sequelize_2.Model {
}
exports.EducationQualificationsItem = EducationQualificationsItem;
EducationQualificationsItem.init({
    id: {
        type: sequelize_2.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    education_qualifications_category_id: {
        type: sequelize_2.DataTypes.INTEGER,
        allowNull: false,
    },
    qualifications_name: {
        type: sequelize_2.DataTypes.STRING(300),
        allowNull: false
    },
}, {
    sequelize: sequelize_1.sequelize,
    modelName: "EducationQualificationsItem",
    tableName: "education_qualifications_item",
    timestamps: false,
    underscored: true,
    indexes: [{ fields: ["education_qualifications_category_id"] }]
});
