"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BirthLocation = void 0;
const sequelize_1 = require("./../sequelize");
const sequelize_2 = require("sequelize");
class BirthLocation extends sequelize_2.Model {
}
exports.BirthLocation = BirthLocation;
BirthLocation.init({
    id: {
        type: sequelize_2.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    time_zone: {
        type: sequelize_2.DataTypes.STRING(10),
        allowNull: true
    },
    name: {
        type: sequelize_2.DataTypes.TEXT,
        allowNull: true,
    },
    longitude: {
        type: sequelize_2.DataTypes.DOUBLE,
        allowNull: true,
    },
    latitude: {
        type: sequelize_2.DataTypes.DOUBLE,
        allowNull: true,
    },
}, {
    sequelize: sequelize_1.sequelize,
    modelName: "BirthLocation",
    tableName: "birth_location",
    timestamps: false,
    underscored: true
});
