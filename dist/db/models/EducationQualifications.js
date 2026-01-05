"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EducationQualifications = void 0;
const sequelize_1 = require("../sequelize");
const sequelize_2 = require("sequelize");
class EducationQualifications extends sequelize_2.Model {
}
exports.EducationQualifications = EducationQualifications;
EducationQualifications.init({
    id: {
        type: sequelize_2.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    user_id: {
        type: sequelize_2.DataTypes.STRING(100),
        allowNull: false,
    },
    education_qualifications_item_id: {
        type: sequelize_2.DataTypes.INTEGER,
        allowNull: false,
    },
}, {
    sequelize: sequelize_1.sequelize,
    modelName: "EducationQualifications",
    tableName: "education_qualifications",
    timestamps: false,
    underscored: true,
    indexes: [{ fields: ["user_id"] }, { fields: ["education_qualifications_item_id"] }]
});
