"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeceasedFamilyMember = void 0;
const sequelize_1 = require("sequelize");
const sequelize_2 = require("../sequelize");
class DeceasedFamilyMember extends sequelize_1.Model {
}
exports.DeceasedFamilyMember = DeceasedFamilyMember;
DeceasedFamilyMember.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    userId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    relationship: {
        type: sequelize_1.DataTypes.STRING(100),
        allowNull: false,
    },
    date_of_birth: {
        type: sequelize_1.DataTypes.DATEONLY,
        allowNull: true,
    },
    birth_time: {
        type: sequelize_1.DataTypes.TIME,
        allowNull: true,
    },
    birth_location_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true,
    },
    year_of_death: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true,
    },
    cause_of_death: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: true,
    },
    created_at: {
        type: sequelize_1.DataTypes.DATE,
        defaultValue: sequelize_2.sequelize.literal('CURRENT_TIMESTAMP'),
    },
    updated_at: {
        type: sequelize_1.DataTypes.DATE,
        defaultValue: sequelize_2.sequelize.literal('CURRENT_TIMESTAMP'),
    },
}, {
    sequelize: sequelize_2.sequelize,
    modelName: "DeceasedFamilyMember",
    tableName: "deceased_family_members",
    timestamps: true,
    underscored: false,
});
