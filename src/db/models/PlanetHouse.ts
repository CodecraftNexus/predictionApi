import { sequelize } from "./../sequelize";
import { Model, DataTypes } from "sequelize";
import { PalentHouseAttributes, PalentHouseCreationAttributes } from "../type";


export class PalentHouse extends Model<PalentHouseAttributes, PalentHouseCreationAttributes> implements PalentHouseAttributes {
    declare id: string;
    declare userId: string;
    declare lagnaya: string;
    declare box1?: string | null; 
    declare box2?: string | null; 
    declare box3?: string | null; 
    declare box4?: string | null; 
    declare box5?: string | null; 
    declare box6?: string | null; 
    declare box7?: string | null; 
    declare box8?: string | null; 
    declare box9?: string | null; 
    declare box10?: string | null; 
    declare box11?: string | null; 
    declare box12?: string | null; 
}


PalentHouse.init({
    id : {
        type : DataTypes.INTEGER,
        primaryKey : true,
        autoIncrement : true,
    },
    userId : {
        type : DataTypes.INTEGER,
        allowNull : false,
    },
    lagnaya : { 
        type : DataTypes.STRING(50),
        allowNull : false,
    },
    box1 :{
        type : DataTypes.STRING(50),
        allowNull : true,
    },
    box2 :{
        type : DataTypes.STRING(50),
        allowNull : true,
    },
    box3 :{
        type : DataTypes.STRING(50),
        allowNull : true,
    },
    box4 :{
        type : DataTypes.STRING(50),
        allowNull : true,
    },
    box5 :{
        type : DataTypes.STRING(50),
        allowNull : true,
    },
    box6 :{
        type : DataTypes.STRING(50),
        allowNull : true,
    },
    box7 :{
        type : DataTypes.STRING(50),
        allowNull : true,
    },
    box8 :{
        type : DataTypes.STRING(50),
        allowNull : true,
    },
    box9 :{
        type : DataTypes.STRING(50),
        allowNull : true,
    },
    box10 :{
        type : DataTypes.STRING(50),
        allowNull : true,
    },
    box11:{
        type : DataTypes.STRING(50),
        allowNull : true,
    },

    box12 :{
        type : DataTypes.STRING(50),
        allowNull : true,
    }

},{
  sequelize,
  modelName : "PlanetHouse",
  tableName : "planet_house",
  timestamps : false,
  indexes : [{ fields: ["userId"] }]
}

)