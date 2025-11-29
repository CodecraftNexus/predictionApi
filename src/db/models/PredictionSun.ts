import { sequelize } from "../sequelize";
import { Model, DataTypes } from "sequelize";
import {sunPredictionAttributes } from "../type";


export class sunPrediction extends Model<sunPredictionAttributes> implements sunPredictionAttributes {
    declare id: string;
    declare userId: string;
    declare general_prediction: string;
    declare personalised_prediction: string;
    declare planet_zodiac_prediction: string;
    declare verbal_location: string;
}

sunPrediction.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },

    general_prediction: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    personalised_prediction: {
        type: DataTypes.TEXT,
        allowNull: false
    },

    planet_zodiac_prediction: {
        type: DataTypes.TEXT,
        allowNull: false
    },

    verbal_location: {
        type: DataTypes.STRING(250),
        allowNull: false
    }

},
    {
        sequelize,
        modelName: "PredictionSun",
        tableName: "Prediction_sun",
        timestamps: false,

    }
)