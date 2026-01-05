"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AstrologicalDetails = void 0;
const sequelize_1 = require("./../sequelize");
const sequelize_2 = require("sequelize");
class AstrologicalDetails extends sequelize_2.Model {
}
exports.AstrologicalDetails = AstrologicalDetails;
AstrologicalDetails.init({
    id: {
        type: sequelize_2.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    user_id: {
        type: sequelize_2.DataTypes.STRING(100),
        allowNull: false,
    },
    gana: {
        type: sequelize_2.DataTypes.STRING(100),
        allowNull: false
    },
    yoni: {
        type: sequelize_2.DataTypes.STRING(100),
        allowNull: false
    },
    vasya: {
        type: sequelize_2.DataTypes.STRING(100),
        allowNull: false
    },
    nadi: {
        type: sequelize_2.DataTypes.STRING(100),
        allowNull: false
    },
    varna: {
        type: sequelize_2.DataTypes.STRING(100),
        allowNull: false
    },
    paya: {
        type: sequelize_2.DataTypes.STRING(100),
        allowNull: false
    },
    paya_by_nakshatra: {
        type: sequelize_2.DataTypes.STRING(100),
        allowNull: false
    },
    tatva: {
        type: sequelize_2.DataTypes.STRING(100),
        allowNull: false
    },
    life_stone: {
        type: sequelize_2.DataTypes.STRING(100),
        allowNull: false
    },
    lucky_stone: {
        type: sequelize_2.DataTypes.STRING(100),
        allowNull: false
    },
    fortune_stone: {
        type: sequelize_2.DataTypes.STRING(100),
        allowNull: false
    },
    name_start: {
        type: sequelize_2.DataTypes.STRING(100),
        allowNull: false
    },
    ascendant_sign: {
        type: sequelize_2.DataTypes.STRING(100),
        allowNull: false
    },
    ascendant_nakshatra: {
        type: sequelize_2.DataTypes.STRING(100),
        allowNull: false
    },
    rasi: {
        type: sequelize_2.DataTypes.STRING(100),
        allowNull: false
    },
    rasi_lord: {
        type: sequelize_2.DataTypes.STRING(100),
        allowNull: false
    },
    nakshatra: {
        type: sequelize_2.DataTypes.STRING(100),
        allowNull: false
    },
    nakshatra_lord: {
        type: sequelize_2.DataTypes.STRING(100),
        allowNull: false
    },
    nakshatra_pada: {
        type: sequelize_2.DataTypes.INTEGER,
        allowNull: false
    },
    sun_sign: {
        type: sequelize_2.DataTypes.STRING(100),
        allowNull: false
    },
    tithi: {
        type: sequelize_2.DataTypes.STRING(100),
        allowNull: false
    },
    karana: {
        type: sequelize_2.DataTypes.STRING(100),
        allowNull: false
    },
    yoga: {
        type: sequelize_2.DataTypes.STRING(100),
        allowNull: false
    },
    ayanamsa: {
        type: sequelize_2.DataTypes.DOUBLE,
        allowNull: false
    }
}, {
    sequelize: sequelize_1.sequelize,
    modelName: "AstrologicalDetails",
    tableName: "astrological_details",
    timestamps: false,
    underscored: true
});
