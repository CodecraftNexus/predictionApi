"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initPredictionRelationship = initPredictionRelationship;
function initPredictionRelationship(models) {
    const { Users, LifeTimePredictionCategory, LifeTimePredictions, PredictionPlanet, PredictionTranslation, PredictionFeedback, planetLocatinsPredictins } = models;
    if (LifeTimePredictions && PredictionPlanet && LifeTimePredictionCategory) {
        Users.hasMany(LifeTimePredictions, { foreignKey: "user_id", as: "predictions" });
        LifeTimePredictions.belongsTo(Users, { foreignKey: "user_id", as: "user" });
        PredictionPlanet.hasMany(LifeTimePredictions, { foreignKey: "prediction_planet_id", as: "predictions" });
        LifeTimePredictions.belongsTo(PredictionPlanet, { foreignKey: "prediction_planet_id", as: "planet" });
        LifeTimePredictionCategory.hasMany(LifeTimePredictions, { foreignKey: "life_time_prediction_category_id", as: "predictions" });
        LifeTimePredictions.belongsTo(LifeTimePredictionCategory, { foreignKey: "life_time_prediction_category_id", as: "category" });
    }
    if (PredictionTranslation && PredictionPlanet && LifeTimePredictionCategory) {
        PredictionPlanet.hasMany(PredictionTranslation, { foreignKey: "prediction_planet_id", as: "translations" });
        PredictionTranslation.belongsTo(PredictionPlanet, { foreignKey: "prediction_planet_id", as: "planet" });
        LifeTimePredictionCategory.hasMany(PredictionTranslation, { foreignKey: "life_time_prediction_category_id", as: "translations" });
        PredictionTranslation.belongsTo(LifeTimePredictionCategory, { foreignKey: "life_time_prediction_category_id", as: "category" });
    }
    if (PredictionFeedback && PredictionPlanet && LifeTimePredictionCategory) {
        Users.hasMany(PredictionFeedback, { foreignKey: "user_id", as: "feedbacks" });
        PredictionFeedback.belongsTo(Users, { foreignKey: "user_id", as: "user" });
        PredictionPlanet.hasMany(PredictionFeedback, { foreignKey: "prediction_planet_id", as: "feedbacks" });
        PredictionFeedback.belongsTo(PredictionPlanet, { foreignKey: "prediction_planet_id", as: "planet" });
        LifeTimePredictionCategory.hasMany(PredictionFeedback, { foreignKey: "life_time_prediction_category_id", as: "feedbacks" });
        PredictionFeedback.belongsTo(LifeTimePredictionCategory, { foreignKey: "life_time_prediction_category_id", as: "category" });
    }
    if (planetLocatinsPredictins && PredictionPlanet) {
        PredictionPlanet.hasMany(planetLocatinsPredictins, {
            foreignKey: "prediction_planet_id",
            as: "LocationsPredictions"
        });
        planetLocatinsPredictins.belongsTo(PredictionPlanet, {
            foreignKey: "PredictionPlanetId",
            as: "predictionPlanet"
        });
    }
}
