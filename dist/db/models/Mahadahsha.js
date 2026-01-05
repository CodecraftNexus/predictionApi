"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Mahadahsha = void 0;
const sequelize_1 = require("../sequelize");
const sequelize_2 = require("sequelize");
class Mahadahsha extends sequelize_2.Model {
}
exports.Mahadahsha = Mahadahsha;
Mahadahsha.init({
    id: {
        type: sequelize_2.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    user_id: {
        type: sequelize_2.DataTypes.STRING(100),
        allowNull: false,
    },
    dashawa: {
        type: sequelize_2.DataTypes.STRING(150),
        allowNull: false,
    },
    from: {
        type: sequelize_2.DataTypes.DATEONLY,
        allowNull: false,
    },
    to: {
        type: sequelize_2.DataTypes.DATEONLY,
        allowNull: false,
    },
}, {
    sequelize: sequelize_1.sequelize,
    modelName: "Mahadahsha",
    tableName: "mahadahsha",
    underscored: true,
    indexes: [
        { fields: ["user_id"] }
    ],
    timestamps: false
});
