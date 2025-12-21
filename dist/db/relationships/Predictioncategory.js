"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initPredictioncategoryRelationship = initPredictioncategoryRelationship;
function initPredictioncategoryRelationship(models) {
    const { PredictionItems, Predictioncategory } = models;
    if (PredictionItems) {
        Predictioncategory.hasMany(PredictionItems, {
            foreignKey: "predcitonCatId",
            as: 'predictionItems'
        });
    }
}
