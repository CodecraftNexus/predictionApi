import { JobsAttributes } from './../type';


import { sequelize } from "./../sequelize";
import { DataTypes, Model } from "sequelize";

export class Jobs extends Model<JobsAttributes> implements  JobsAttributes {
    declare id: string;
    declare userId: string;
    declare JobItemId: string;
}



Jobs.init({
    id : {
        type : DataTypes.INTEGER,
        primaryKey : true,
        autoIncrement : true,
    },
    userId : {
        type : DataTypes.INTEGER,
        allowNull : false,
    },
    JobItemId : {
        type : DataTypes.INTEGER,
        allowNull : false,
    },
},
{
    sequelize,
    modelName : "Jobs",
    tableName : "jobs",
    timestamps : false,
}

)