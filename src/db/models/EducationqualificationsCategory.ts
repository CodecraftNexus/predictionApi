import { DataTypes, Model } from "sequelize";
import { sequelize } from "../sequelize";
import { EducationqualificationsCategoryAttributes } from "../type";


export class EducationqualificationsCatagory extends Model<EducationqualificationsCategoryAttributes> implements EducationqualificationsCategoryAttributes {
    declare id: string;
    declare CategoryName: string;
}


EducationqualificationsCatagory.init({
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
        modelName: "EducationqualificationsCatagory",
        tableName: "education_qualifications_catagory",
        timestamps: false,
    }
)