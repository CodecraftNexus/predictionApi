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
const TranslationManagement_1 = require("../translation/TranslationManagement");
const splitIntoSentences = (text) => {
    if (!text || typeof text !== 'string')
        return [];
    return text
        .split(/\.(?=\s|$)/)
        .map(s => s.trim())
        .filter(s => s.length > 0)
        .map(s => s.endsWith('.') ? s : `${s}.`);
};
const translateToSentenceArray = (text, language) => __awaiter(void 0, void 0, void 0, function* () {
    if (!text || typeof text !== 'string')
        return [];
    const englishSentences = splitIntoSentences(text);
    if (language === 'en') {
        return englishSentences;
    }
    const translatedSentences = [];
    for (const sentence of englishSentences) {
        try {
            const translated = yield (0, TranslationManagement_1.getOrCreateTranslation)(sentence, language);
            translatedSentences.push(translated);
        }
        catch (error) {
            console.error('Translation failed for sentence:', sentence, error);
            translatedSentences.push(sentence);
        }
    }
    return translatedSentences;
});
const savePredictionFromApi = (userId_1, apiResponse_1, planet_1, ...args_1) => __awaiter(void 0, [userId_1, apiResponse_1, planet_1, ...args_1], void 0, function* (userId, apiResponse, planet, language = 'en') {
    var _a;
    const predictions = apiResponse.response;
    if (!predictions || !Array.isArray(predictions) || predictions.length === 0 || !planet) {
        throw new Error("Invalid planet prediction API response structure");
    }
    const [planetRecord] = yield db_1.db.PredictionPlanet.findOrCreate({
        where: { planet_name: planet },
        defaults: { planet_name: planet }
    });
    const categories = yield db_1.db.LifeTimePredictionCategory.findAll();
    const categoryMap = new Map();
    categories.forEach((cat) => {
        categoryMap.set(cat.name, cat.id);
    });
    const generalCategoryId = categoryMap.get('General Prediction');
    const personalisedCategoryId = categoryMap.get('Personalised Prediction');
    const zodiacCategoryId = categoryMap.get('Planet Zodiac Prediction');
    const verbalLocationCategoryId = categoryMap.get('Verbal Location');
    for (const pred of predictions) {
        if (generalCategoryId && pred.general_prediction) {
            yield db_1.db.LifeTimePredictions.findOrCreate({
                where: {
                    user_id: String(userId),
                    prediction_planet_id: planetRecord.id,
                    life_time_prediction_category_id: generalCategoryId,
                },
                defaults: {
                    user_id: String(userId),
                    prediction_planet_id: planetRecord.id,
                    life_time_prediction_category_id: String(generalCategoryId),
                    predciton: pred.general_prediction
                }
            }).then(([record, created]) => {
                if (!created && record.predciton !== pred.general_prediction) {
                    return record.update({ predciton: pred.general_prediction });
                }
            });
        }
        if (personalisedCategoryId && pred.personalised_prediction) {
            yield db_1.db.LifeTimePredictions.findOrCreate({
                where: {
                    user_id: String(userId),
                    prediction_planet_id: planetRecord.id,
                    life_time_prediction_category_id: personalisedCategoryId
                },
                defaults: {
                    user_id: String(userId),
                    prediction_planet_id: planetRecord.id,
                    life_time_prediction_category_id: String(personalisedCategoryId),
                    predciton: pred.personalised_prediction
                }
            }).then(([record, created]) => {
                if (!created && record.predciton !== pred.personalised_prediction) {
                    return record.update({ predciton: pred.personalised_prediction });
                }
            });
        }
        if (zodiacCategoryId && pred.planet_zodiac_prediction) {
            yield db_1.db.LifeTimePredictions.findOrCreate({
                where: {
                    user_id: String(userId),
                    prediction_planet_id: planetRecord.id,
                    life_time_prediction_category_id: zodiacCategoryId
                },
                defaults: {
                    user_id: String(userId),
                    prediction_planet_id: planetRecord.id,
                    life_time_prediction_category_id: String(zodiacCategoryId),
                    predciton: pred.planet_zodiac_prediction
                }
            }).then(([record, created]) => {
                if (!created && record.predciton !== pred.planet_zodiac_prediction) {
                    return record.update({ predciton: pred.planet_zodiac_prediction });
                }
            });
        }
        if (verbalLocationCategoryId && pred.verbal_location) {
            yield db_1.db.LifeTimePredictions.findOrCreate({
                where: {
                    user_id: String(userId),
                    prediction_planet_id: planetRecord.id,
                    life_time_prediction_category_id: verbalLocationCategoryId
                },
                defaults: {
                    user_id: String(userId),
                    prediction_planet_id: planetRecord.id,
                    life_time_prediction_category_id: String(verbalLocationCategoryId),
                    predciton: pred.verbal_location
                }
            }).then(([record, created]) => {
                if (!created && record.predciton !== pred.verbal_location) {
                    return record.update({ predciton: pred.verbal_location });
                }
            });
        }
    }
    const savedPredictions = yield db_1.db.LifeTimePredictions.findAll({
        where: {
            user_id: String(userId),
            prediction_planet_id: planetRecord.id
        },
        include: [
            {
                model: db_1.db.LifeTimePredictionCategory,
                as: 'category',
                attributes: ['id', 'name']
            }
        ]
    });
    const translatedData = {};
    for (const pred of savedPredictions) {
        const categoryName = pred.category.name;
        try {
            const sentenceArray = yield translateToSentenceArray(pred.predciton, language);
            translatedData[categoryName] = sentenceArray;
        }
        catch (error) {
            console.error(`Translation failed for ${categoryName}:`, error);
            translatedData[categoryName] = splitIntoSentences(pred.predciton);
        }
    }
    const formattedPredictions = [];
    const categoryOrder = [
        'General Prediction',
        'Personalised Prediction',
        'Planet Zodiac Prediction',
        'Verbal Location'
    ];
    for (const categoryName of categoryOrder) {
        if (translatedData[categoryName]) {
            const englishSentences = splitIntoSentences(((_a = savedPredictions.find((p) => p.category.name === categoryName)) === null || _a === void 0 ? void 0 : _a.predciton) || '');
            formattedPredictions.push({
                title: categoryName,
                category: categoryName,
                predictionText: translatedData[categoryName],
                predictionTextEn: englishSentences,
            });
        }
    }
    const verbalLocationItem = formattedPredictions.find(item => item.category === 'Verbal Location');
    if (verbalLocationItem && !Array.isArray(verbalLocationItem.predictionText)) {
        verbalLocationItem.predictionText = verbalLocationItem.predictionText ? [verbalLocationItem.predictionText] : [];
        verbalLocationItem.predictionTextEn = verbalLocationItem.predictionTextEn ? [verbalLocationItem.predictionTextEn[0] || ''] : [];
    }
    const requestedLangPrediction = {
        language: language,
        planet: planet,
        predictions: formattedPredictions
    };
    const predictionsArray = [requestedLangPrediction];
    return {
        success: true,
        data: { predictions: predictionsArray },
        message: `${planet} prediction data saved and retrieved successfully (Language: ${language})`,
        language: language
    };
});
exports.savePredictionFromApi = savePredictionFromApi;
