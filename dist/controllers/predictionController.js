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
exports.getExistingPredictions = getExistingPredictions;
exports.Predictions = Predictions;
const env_1 = require("../config/env");
const astrologyParams_1 = require("../utils/astrologyParams");
const PredictionsSeve_1 = require("../utils/seveFunctions/PredictionsSeve");
const db_1 = require("../db");
function getExistingPredictions(userId_1, planet_1, planetId_1) {
    return __awaiter(this, arguments, void 0, function* (userId, planet, planetId, isLLM = false) {
        let planetPrediction = null;
        if (planet || planetId) {
            planetPrediction = yield db_1.db.PredictionPlanet.findOne({
                where: planetId ? { id: Number(planetId) } : { PlanetName: String(planet) }
            });
            if (!planetPrediction) {
                return [];
            }
        }
        const savedPredictions = yield db_1.db.Predictions.findAll({
            where: { userId: String(userId), PredictionPlanetId: planetPrediction.id },
            attributes: ['general_prediction', 'personalised_prediction', 'planet_zodiac_prediction', 'verbal_location'],
        });
        if (savedPredictions.length === 0) {
            return null;
        }
        let predictionName = planet;
        if (isLLM && !planet && planetPrediction) {
            predictionName = planetPrediction.PlanetName;
        }
        const formattedData = savedPredictions.map(pred => ({
            Predictionsname: predictionName,
            "General Prediction": pred.general_prediction,
            "Personalised Prediction": pred.personalised_prediction,
            "Planet Zodiac Prediction": pred.planet_zodiac_prediction,
            "Verbal Location": pred.verbal_location,
        }));
        if (isLLM) {
            return formattedData.map(prediction => {
                const formatToBulletPoints = (text) => {
                    if (!text)
                        return [];
                    const sentences = text
                        .split('.')
                        .map(s => s.trim())
                        .filter(s => s.length > 0)
                        .map(s => `${s}.`);
                    return sentences;
                };
                return {
                    planet: prediction.Predictionsname,
                    general_prediction: formatToBulletPoints(prediction["General Prediction"]),
                    personalised_prediction: formatToBulletPoints(prediction["Personalised Prediction"]),
                    planet_zodiac_prediction: formatToBulletPoints(prediction["Planet Zodiac Prediction"]),
                    verbal_location: [prediction["Verbal Location"]]
                };
            });
        }
        else {
            return {
                success: true,
                data: { predictions: formattedData },
                message: `${planet || predictionName || 'Planet'} prediction data retrieved successfully`,
            };
        }
    });
}
function Predictions(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const planetName = req.params.planetName;
            const { userId } = yield (0, astrologyParams_1.getAstrologyApiParams)(req.user.userId || "", planetName);
            const existing = yield getExistingPredictions(userId, planetName);
            if (existing) {
                return res.json({
                    success: true,
                    message: `${planetName} prediction retrieved from database successfully`,
                    result: existing
                });
            }
            const { params } = yield (0, astrologyParams_1.getAstrologyApiParams)(req.user.userId || "", planetName);
            const apiUrl = `${env_1.env.predictionApiUrl}?${params}`;
            const response = yield fetch(apiUrl, {
                headers: {
                    'User-Agent': 'Horoscope/1.0'
                }
            });
            if (!response.ok) {
                const text = yield response.text();
                console.error("API Error Response:", text);
                return res.status(502).json({
                    success: false,
                    message: "External API error",
                    status: response.status,
                    statusText: response.statusText,
                    body: text.substring(0, 500)
                });
            }
            const data = yield response.json();
            if (!data || typeof data !== 'object') {
                return res.status(502).json({ success: false, message: "Invalid response format from API" });
            }
            if (data.success === false) {
                return res.status(502).json({
                    success: false,
                    message: "API returned error",
                    apiError: data.message || data.error || "Unknown error from API"
                });
            }
            if (!data || !data.response) {
                console.error("Unexpected API response structure:", JSON.stringify(data, null, 2));
                return res.status(502).json({
                    success: false,
                    message: "Unexpected response structure",
                    received: data
                });
            }
            const result = yield (0, PredictionsSeve_1.savePredictionFromApi)(userId, data, planetName);
            return res.json({
                success: true,
                message: `${planetName} prediction generated and saved successfully`,
                result
            });
        }
        catch (error) {
            console.error(`Error in /prediction route for planet ${req.params.planetName}:`, error);
            return res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    });
}
