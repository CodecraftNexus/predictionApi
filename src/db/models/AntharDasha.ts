import { sequelize } from "./../sequelize";
import { Model, DataTypes } from "sequelize";
import { antharDashaBalanceAttributes } from "../type";


export class AntharDasha extends Model<antharDashaBalanceAttributes> implements antharDashaBalanceAttributes {
    declare id: string;
    declare userId: string;
    declare anthardhashawa: string;
    declare From: string;
    declare To: string;
    declare setNo: string;
}


AntharDasha.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },

    anthardhashawa: {
        type: DataTypes.STRING(200),
        allowNull: false
    },
    setNo: {
        type: DataTypes.INTEGER,
        allowNull: false
    },

    From: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },

    To: {
        type: DataTypes.DATEONLY,
        allowNull: false
    }

},
    {
        sequelize,
        modelName: "AntharDasha",
        tableName: "anthar_dasha",
        timestamps: false,

    }
)