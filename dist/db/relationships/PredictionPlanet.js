"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initPredictionPlanetRelationship = initPredictionPlanetRelationship;
function initPredictionPlanetRelationship(models) {
    const { Predictions, PredictionPlanet, User, planetLocatinsPredictins } = models;
    if (!Predictions)
        return;
    if (PredictionPlanet) {
        Predictions.belongsTo(PredictionPlanet, {
            foreignKey: "PredictionPlanetId",
            as: "predictionPlanet"
        });
    }
    if (planetLocatinsPredictins) {
        planetLocatinsPredictins.belongsTo(PredictionPlanet, {
            foreignKey: "PredictionPlanetId",
            as: "predictionPlanet"
        });
        PredictionPlanet.hasMany(planetLocatinsPredictins, {
            foreignKey: "PredictionPlanetId",
            as: "predictionPlanet"
        });
    }
    if (User) {
        Predictions.belongsTo(User, {
            foreignKey: "userId",
            as: "user"
        });
    }
}
