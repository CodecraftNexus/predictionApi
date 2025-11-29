

import { sequelize } from "./../sequelize";
import { DataTypes, Model } from "sequelize";
import {  EducationqualificationsAttributes } from "../type";


export class Educationqualifications extends Model<EducationqualificationsAttributes> implements  EducationqualificationsAttributes {
    declare id: string;
    declare userId: string;
    declare EducationqualificationsItemId: string;
}



Educationqualifications.init({
    id : {
        type : DataTypes.INTEGER,
        primaryKey : true,
        autoIncrement : true,
    },
    userId : {
        type : DataTypes.INTEGER,
        allowNull : false,
    },
    EducationqualificationsItemId : {
        type : DataTypes.STRING(300),
        allowNull : false,
    },
},
{
    sequelize,
    modelName : "Educationqualifications",
    tableName : "education_qualifications",
    timestamps : false,
}

)