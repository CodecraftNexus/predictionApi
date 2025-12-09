"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initPredictionPlanetRelationship = initPredictionPlanetRelationship;
function initPredictionPlanetRelationship(models) {
    const { Predictions, PredictionPlanet } = models;
    if (!PredictionPlanet || !Predictions)
        return;
    PredictionPlanet.hasMany(Predictions, {
        sourceKey: "id",
        foreignKey: "predictionPlanetId",
    });
}
