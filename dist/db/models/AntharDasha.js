"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AntharDasha = void 0;
const sequelize_1 = require("./../sequelize");
const sequelize_2 = require("sequelize");
class AntharDasha extends sequelize_2.Model {
}
exports.AntharDasha = AntharDasha;
AntharDasha.init({
    id: {
        type: sequelize_2.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    userId: {
        type: sequelize_2.DataTypes.INTEGER,
        allowNull: false,
    },
    anthardhashawa: {
        type: sequelize_2.DataTypes.STRING(200),
        allowNull: false
    },
    setNo: {
        type: sequelize_2.DataTypes.INTEGER,
        allowNull: false
    },
    From: {
        type: sequelize_2.DataTypes.DATEONLY,
        allowNull: false
    },
    To: {
        type: sequelize_2.DataTypes.DATEONLY,
        allowNull: false
    }
}, {
    sequelize: sequelize_1.sequelize,
    modelName: "AntharDasha",
    tableName: "anthar_dasha",
    timestamps: false,
});
