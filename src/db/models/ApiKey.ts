import {sequelize} from "./../sequelize";
import { Model, DataTypes } from "sequelize";
import { ApiKeyAttributes, ApiKeyCreationAttributes } from "../type";

export class ApiKey extends Model<ApiKeyAttributes , ApiKeyCreationAttributes> implements ApiKeyAttributes {
    declare id: string;
    declare key: string;
}


ApiKey.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    key: {
        type: DataTypes.STRING(250),
        allowNull: false
    }
},
    {
        sequelize,
        modelName: "ApiKey",
        tableName: "api_key",
        timestamps: false,
    }

)