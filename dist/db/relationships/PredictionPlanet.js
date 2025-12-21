"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initPredictionPlanetRelationship = initPredictionPlanetRelationship;
function initPredictionPlanetRelationship(models) {
    const { Predictions, PredictionPlanet, User, planetLocationsPredictions, PredictionItems } = models;
    if (!Predictions)
        return;
    if (PredictionPlanet) {
        Predictions.belongsTo(PredictionPlanet, {
            foreignKey: "PredictionPlanetId",
            as: "predictionPlanet"
        });
        PredictionPlanet.hasMany(Predictions, {
            foreignKey: "PredictionPlanetId",
            as: "predictions"
        });
    }
    if (planetLocationsPredictions) {
        planetLocationsPredictions.belongsTo(PredictionPlanet, {
            foreignKey: "PredictionPlanetId",
            as: "predictionPlanet"
        });
        PredictionPlanet.hasMany(planetLocationsPredictions, {
            foreignKey: "PredictionPlanetId",
            as: "planetLocationsPredictions"
        });
    }
    if (PredictionItems) {
        PredictionItems.belongsTo(PredictionPlanet, {
            foreignKey: "PredictionPlanetId",
            as: "predictionPlanet"
        });
        PredictionPlanet.hasMany(PredictionItems, {
            foreignKey: "PredictionPlanetId",
            as: "predictionItems"
        });
    }
    if (User) {
        Predictions.belongsTo(User, {
            foreignKey: "userId",
            as: "user"
        });
    }
}
