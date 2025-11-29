import { DataTypes, Model } from "sequelize";
import { sequelize } from "../sequelize";
import {JobsCategoryAttributes } from "../type";


export class JobsCategory extends Model<JobsCategoryAttributes> implements JobsCategoryAttributes {
    declare id: string;
    declare CategoryName: string;
}


JobsCategory.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    CategoryName: {
        type: DataTypes.STRING(300),
        allowNull: false
    },
},
    {
        sequelize,
        modelName: "JobsCategory",
        tableName: "jobs_category",
        timestamps: false,
    }
)