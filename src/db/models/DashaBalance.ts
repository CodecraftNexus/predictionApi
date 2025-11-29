import { sequelize } from "./../sequelize";
import { Model, DataTypes } from "sequelize";
import { DashaBalanceAttributes } from "../type";

export class DashaBalance extends Model<DashaBalanceAttributes> implements DashaBalanceAttributes {
    declare id: string;
    declare userId: string;
    declare dashawa: string;
    declare From: string;
    declare To: string;
}

DashaBalance.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    userId : {
        type : DataTypes.INTEGER,
        allowNull : false,
    },
    dashawa: {
        type: DataTypes.STRING(150),
        allowNull: false,
    },
    From: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    },
    To: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    },
},
    {
        sequelize,
        modelName: "DashaBalane",
        tableName: "dasha_balance",
        timestamps: false
    }

)