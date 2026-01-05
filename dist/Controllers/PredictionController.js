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
exports.LifeTimePredictions = void 0;
exports.getExistingPredictions = getExistingPredictions;
const db_1 = require("../db");
const asyncHandler_1 = require("../utils/asyncHandler");
const astrologyParams_1 = require("../utils/astrologyParams");
const env_1 = require("../config/env");
const PredictionsSeve_1 = require("../utils/SeveFunctions/PredictionsSeve");
const TranslationManagement_1 = require("../utils/translation/TranslationManagement");
const inspector_1 = require("inspector");
function getExistingPredictions(userId_1, planet_1, planetId_1) {
    return __awaiter(this, arguments, void 0, function* (userId, planet, planetId, isLLM = false, language = 'en') {
        var _a, _b, _c, _d;
        let planetPrediction = null;
        if (planet || planetId) {
            planetPrediction = yield db_1.db.PredictionPlanet.findOne({
                where: planetId ? { id: Number(planetId) } : { planet_name: String(planet) }
            });
            if (!planetPrediction) {
                return isLLM ? [] : { success: false, data: null, message: "Planet not found" };
            }
        }
        const savedPredictions = yield db_1.db.LifeTimePredictions.findAll({
            where: {
                user_id: String(userId),
                prediction_planet_id: (planetPrediction === null || planetPrediction === void 0 ? void 0 : planetPrediction.id) || null
            },
            include: [
                {
                    model: db_1.db.LifeTimePredictionCategory,
                    as: 'category',
                    attributes: ['id', 'name']
                }
            ]
        });
        if (savedPredictions.length === 0) {
            return isLLM ? [] : null;
        }
        const planetName = planet || (planetPrediction === null || planetPrediction === void 0 ? void 0 : planetPrediction.planet_name);
        const splitIntoSentences = (text) => {
            if (!text || typeof text !== 'string')
                return [];
            return text
                .split(/\.(?=\s|$)/)
                .map(s => s.trim())
                .filter(s => s.length > 0)
                .map(s => s.endsWith('.') ? s : `${s}.`);
        };
        const translateToSentenceArray = (text) => __awaiter(this, void 0, void 0, function* () {
            if (language === 'en') {
                return splitIntoSentences(text);
            }
            const sentences = splitIntoSentences(text);
            const translated = [];
            for (const sentence of sentences) {
                try {
                    const trans = yield (0, TranslationManagement_1.getOrCreateTranslation)(sentence, language);
                    translated.push(trans);
                }
                catch (error) {
                    inspector_1.console.error('Translation failed for sentence:', sentence, error);
                    translated.push(sentence);
                }
            }
            return translated;
        });
        const categoryData = {};
        for (const pred of savedPredictions) {
            const categoryName = pred.category.name;
            const originalText = pred.predciton || '';
            const enSentences = splitIntoSentences(originalText);
            const translatedSentences = yield translateToSentenceArray(originalText);
            categoryData[categoryName] = {
                en: enSentences,
                translated: translatedSentences
            };
        }
        const categoryOrder = [
            'General Prediction',
            'Personalised Prediction',
            'Planet Zodiac Prediction',
            'Verbal Location'
        ];
        const formattedPredictions = categoryOrder
            .filter(cat => categoryData[cat])
            .map(cat => ({
            title: cat,
            category: cat,
            predictionText: categoryData[cat].translated,
            predictionTextEn: categoryData[cat].en
        }));
        const verbalItem = formattedPredictions.find(p => p.category === 'Verbal Location');
        if (verbalItem && verbalItem.predictionText.length === 1 && verbalItem.predictionText[0] === '') {
            verbalItem.predictionText = [];
            verbalItem.predictionTextEn = [];
        }
        if (isLLM) {
            const baseFormatted = {
                planet: planetName,
                general_prediction: ((_a = categoryData['General Prediction']) === null || _a === void 0 ? void 0 : _a.translated) || [],
                personalised_prediction: ((_b = categoryData['Personalised Prediction']) === null || _b === void 0 ? void 0 : _b.translated) || [],
                planet_zodiac_prediction: ((_c = categoryData['Planet Zodiac Prediction']) === null || _c === void 0 ? void 0 : _c.translated) || [],
                verbal_location: ((_d = categoryData['Verbal Location']) === null || _d === void 0 ? void 0 : _d.translated) || []
            };
            return [baseFormatted];
        }
        const responseItem = {
            language: language,
            planet: planetName,
            predictions: formattedPredictions
        };
        return {
            success: true,
            data: { predictions: [responseItem] },
            message: `${planetName} prediction data retrieved successfully (Language: ${language})`,
            language: language
        };
    });
}
exports.LifeTimePredictions = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const planetName = req.params.planetName.charAt(0).toUpperCase() + req.params.planetName.slice(1);
        ;
        const { userId, params } = yield (0, astrologyParams_1.getAstrologyApiParams)(req.user.userId || "", planetName);
        const user = yield db_1.db.Users.findByPk(userId, {
            include: [{
                    model: db_1.db.Language,
                    attributes: ['id', 'name'],
                }]
        });
        const userWithRelations = user;
        const language = ['en', 'ta', 'si'].includes(userWithRelations.Language.name) ? userWithRelations.Language.name : "en";
        const existing = yield getExistingPredictions(userId, planetName, "", false, language);
        if (existing) {
            return res.json({
                success: true,
                message: `${planetName} prediction retrieved from database successfully`,
                result: existing
            });
        }
        const apiUrl = `${env_1.env.LIFETIME_PREDICTION_API_URL}?${params}`;
        const response = yield fetch(apiUrl, {
            headers: {
                'User-Agent': 'Horoscope/1.0'
            }
        });
        if (!response.ok) {
            const text = yield response.text();
            inspector_1.console.error("API Error Response:", text);
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
            inspector_1.console.error("Unexpected API response structure:", JSON.stringify(data, null, 2));
            return res.status(502).json({
                success: false,
                message: "Unexpected response structure",
                received: data
            });
        }
        const result = yield (0, PredictionsSeve_1.savePredictionFromApi)(userId, data, planetName, language);
        return res.json({
            success: true,
            message: `${planetName} prediction generated and saved successfully`,
            result
        });
    }
    catch (error) {
        inspector_1.console.error(`Error in /prediction route for planet ${req.params.planetName}:`, error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
}));
