
import { sequelize } from "./../sequelize";
import { DataTypes, Model } from "sequelize";
import { JobsItemAttributes } from "../type";


export class JobsItem extends Model<JobsItemAttributes> implements  JobsItemAttributes {
    declare id: string;
    declare JobCategoryId: string;
    declare JobsName: string;
}



JobsItem.init({
    id : {
        type : DataTypes.INTEGER,
        primaryKey : true,
        autoIncrement : true,
    },
    JobCategoryId : {
        type : DataTypes.INTEGER,
        allowNull : false,
    },
    JobsName : {
        type : DataTypes.STRING(300),
        allowNull : false,
    },
},
{
    sequelize,
    modelName : "JobsItem",
    tableName : "jobs_item",
    timestamps : false,
}

)