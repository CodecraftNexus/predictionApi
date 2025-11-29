import { UserAttributes, UserCreationAttributes } from './../type';
import { DataTypes, Model } from "sequelize";
import { sequelize } from "../sequelize";


export class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
    declare id: string
    declare name: string;
    declare username?: string | null;
    declare email: string;
    declare birth_location_id: string;
    declare dateOfBirth?: Date | null;
    declare birthTime?: string | null | undefined;
    declare genderId: string;
    declare hashPassword?: string | null;
    declare WhatsappNumber?: string | null;
    gender: any;
    birthLocation: any;


}

User.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING(150),
            allowNull: false
        },
        email: {
            type: DataTypes.STRING(254),
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true
            }
        },
        dateOfBirth: {
            type: DataTypes.DATEONLY,
            allowNull: true,
        },
        birthTime: {
            type: DataTypes.TIME,
            allowNull: true,
        },
        genderId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        birth_location_id : {
             type : DataTypes.INTEGER,
             allowNull : false,
        },
        username: {
            type: DataTypes.STRING(50),
            allowNull: true,
        },
        WhatsappNumber: {
            type: DataTypes.STRING(12),
            allowNull: true,
        },
        hashPassword: {
            type: DataTypes.STRING(250),
            allowNull: true,
        }
    },
    {
        sequelize,
        modelName: "User",
        tableName: "users",
        timestamps: true,
    }
);


  
