"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.savePredictionFromApi = void 0;
const db_1 = require("../../db");
const savePredictionFromApi = (userId, apiResponse, planet) => __awaiter(void 0, void 0, void 0, function* () {
    const predictions = apiResponse.response;
    if (!predictions || !Array.isArray(predictions) || predictions.length === 0 || !planet) {
        throw new Error("Invalid planet prediction API response structure");
    }
    const [planetprodiction] = yield db_1.db.PredictionPlanet.findOrCreate({
        where: { PlanetName: planet },
        defaults: { PlanetName: planet }
    });
    const existingPredictions = yield db_1.db.Predictions.findAll({
        where: { userId: String(userId), PredictionPlanetId: planetprodiction.id },
    });
    const existingByLocation = new Map(existingPredictions.map(pred => [pred.verbal_location, pred]));
    let needsUpdate = false;
    if (existingPredictions.length !== predictions.length) {
        needsUpdate = true;
    }
    else {
        for (const pred of predictions) {
            const existing = existingByLocation.get(pred.verbal_location);
            if (!existing ||
                existing.general_prediction !== pred.general_prediction ||
                existing.personalised_prediction !== pred.personalised_prediction ||
                existing.planet_zodiac_prediction !== pred.planet_zodiac_prediction) {
                needsUpdate = true;
                break;
            }
        }
    }
    if (!needsUpdate) {
        const formattedData = existingPredictions.map(pred => ({
            Predictionsname: planet,
            "General Prediction": pred.general_prediction,
            "Personalised Prediction": pred.personalised_prediction,
            "Planet Zodiac Prediction": pred.planet_zodiac_prediction,
            "Verbal Location": pred.verbal_location,
        }));
        return {
            success: true,
            data: { predictions: formattedData },
            message: `${planet} prediction data saved successfully`,
        };
    }
    const recordsToSave = predictions.map((pred) => ({
        userId: String(userId),
        PredictionPlanetId: planetprodiction.id,
        general_prediction: pred.general_prediction,
        personalised_prediction: pred.personalised_prediction,
        planet_zodiac_prediction: pred.planet_zodiac_prediction,
        verbal_location: pred.verbal_location,
    }));
    for (const record of recordsToSave) {
        const [predRecord, created] = yield db_1.db.Predictions.findOrCreate({
            where: {
                userId: record.userId,
                verbal_location: record.verbal_location,
            },
            defaults: record,
        });
        if (!created) {
            const updates = {};
            if (predRecord.general_prediction !== record.general_prediction) {
                updates.general_prediction = record.general_prediction;
            }
            if (predRecord.personalised_prediction !== record.personalised_prediction) {
                updates.personalised_prediction = record.personalised_prediction;
            }
            if (predRecord.planet_zodiac_prediction !== record.planet_zodiac_prediction) {
                updates.planet_zodiac_prediction = record.planet_zodiac_prediction;
            }
            if (predRecord.PredictionPlanetId !== record.PredictionPlanetId) {
                updates.PredictionPlanetId = record.PredictionPlanetId;
            }
            if (Object.keys(updates).length > 0) {
                yield predRecord.update(updates);
            }
        }
    }
    const savedPredictions = yield db_1.db.Predictions.findAll({
        where: { userId: String(userId), PredictionPlanetId: planetprodiction.id },
        attributes: ['general_prediction', 'personalised_prediction', 'planet_zodiac_prediction', 'verbal_location'],
    });
    const formattedData = savedPredictions.map(pred => ({
        Predictionsname: planet,
        "General Prediction": pred.general_prediction,
        "Personalised Prediction": pred.personalised_prediction,
        "Planet Zodiac Prediction": pred.planet_zodiac_prediction,
        "Verbal Location": pred.verbal_location,
    }));
    return {
        success: true,
        data: { predictions: formattedData },
        message: `${planet} prediction data saved successfully`,
    };
});
exports.savePredictionFromApi = savePredictionFromApi;
