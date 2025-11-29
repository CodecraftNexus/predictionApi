
import { sequelize } from "./../sequelize";
import { DataTypes, Model } from "sequelize";
import {  EducationqualificationsItemAttributes } from "../type";


export class EducationqualificationsItem extends Model<EducationqualificationsItemAttributes> implements  EducationqualificationsItemAttributes {
    declare id: string;
    declare EducationqualificationsCategoryId: string;
    declare qualificationsName: string;
}



EducationqualificationsItem.init({
    id : {
        type : DataTypes.INTEGER,
        primaryKey : true,
        autoIncrement : true,
    },
    EducationqualificationsCategoryId : {
        type : DataTypes.INTEGER,
        allowNull : false,
    },
    qualificationsName : {
        type : DataTypes.STRING(300),
        allowNull : false,
    },
},
{
    sequelize,
    modelName : "EducationqualificationsItem",
    tableName : "education_qualifications_item",
    timestamps : false,
}

)