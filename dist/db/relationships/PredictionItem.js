"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initPredictionItemRelationship = initPredictionItemRelationship;
function initPredictionItemRelationship(models) {
    const { PredictionItems, UserFeedback, Predictioncategory, PredictionPlanet } = models;
    if (PredictionItems)
        return;
    if (UserFeedback) {
        PredictionItems.hasMany(UserFeedback, { foreignKey: "PredictionItemId" });
    }
    PredictionItems.belongsTo(Predictioncategory, {
        foreignKey: 'predcitonCatId',
        as: 'category'
    });
    PredictionItems.belongsTo(PredictionPlanet, {
        foreignKey: 'PredictionPlanetId',
        as: 'predictionPlanet'
    });
    UserFeedback.belongsTo(PredictionItems, {
        foreignKey: 'PredictionItemId',
        as: 'predictionItem'
    });
}
