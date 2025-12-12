"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PalentHouse = void 0;
const sequelize_1 = require("./../sequelize");
const sequelize_2 = require("sequelize");
class PalentHouse extends sequelize_2.Model {
}
exports.PalentHouse = PalentHouse;
PalentHouse.init({
    id: {
        type: sequelize_2.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    userId: {
        type: sequelize_2.DataTypes.INTEGER,
        allowNull: false,
    },
    lagnaya: {
        type: sequelize_2.DataTypes.STRING(50),
        allowNull: false,
    },
    box1: {
        type: sequelize_2.DataTypes.STRING(50),
        allowNull: true,
    },
    box2: {
        type: sequelize_2.DataTypes.STRING(50),
        allowNull: true,
    },
    box3: {
        type: sequelize_2.DataTypes.STRING(50),
        allowNull: true,
    },
    box4: {
        type: sequelize_2.DataTypes.STRING(50),
        allowNull: true,
    },
    box5: {
        type: sequelize_2.DataTypes.STRING(50),
        allowNull: true,
    },
    box6: {
        type: sequelize_2.DataTypes.STRING(50),
        allowNull: true,
    },
    box7: {
        type: sequelize_2.DataTypes.STRING(50),
        allowNull: true,
    },
    box8: {
        type: sequelize_2.DataTypes.STRING(50),
        allowNull: true,
    },
    box9: {
        type: sequelize_2.DataTypes.STRING(50),
        allowNull: true,
    },
    box10: {
        type: sequelize_2.DataTypes.STRING(50),
        allowNull: true,
    },
    box11: {
        type: sequelize_2.DataTypes.STRING(50),
        allowNull: true,
    },
    box12: {
        type: sequelize_2.DataTypes.STRING(50),
        allowNull: true,
    }
}, {
    sequelize: sequelize_1.sequelize,
    modelName: "PlanetHouse",
    tableName: "planet_house",
    timestamps: false,
    indexes: [{ fields: ["userId"] }]
});
