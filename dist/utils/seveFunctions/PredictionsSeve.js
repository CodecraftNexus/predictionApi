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
            yield predRecord.update(record);
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
