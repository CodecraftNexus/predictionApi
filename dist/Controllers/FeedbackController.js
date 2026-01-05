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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPlanetFeedbackStatus = exports.getFeedbackStatus = exports.getAllFeedbacks = exports.submitFeedback = void 0;
const asyncHandler_1 = require("../utils/asyncHandler");
const PredictionFeedbackService_1 = require("../utils/PredictionFeedbackService");
const db_1 = require("../db");
const sequelize_1 = __importDefault(require("sequelize"));
exports.submitFeedback = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.user.userId;
        const { planet, category, predictionText, feedback, language } = req.body;
        if (!planet || !category || !predictionText || !feedback || !language) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields',
                required: ['planet', 'category', 'predictionText', 'feedback', 'language']
            });
        }
        if (!['correct', 'incorrect', 'undecided'].includes(feedback)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid feedback type. Must be: correct, incorrect, or undecided'
            });
        }
        if (!['en', 'si', 'ta'].includes(language)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid language. Must be: en, si, or ta'
            });
        }
        let text = predictionText;
        if (language !== 'en') {
            const result = yield db_1.db.PredictionTranslation.findAll({
                where: {
                    translated_text: predictionText,
                    language: language
                }
            });
            text = result[0].original_text;
        }
        const result = yield (0, PredictionFeedbackService_1.savePredictionFeedback)(String(userId), planet, category, text, feedback);
        return res.status(200).json(result);
    }
    catch (error) {
        console.error('Submit feedback error:', error);
        return res.status(500).json({
            success: false,
            message: error.message || 'Failed to submit feedback'
        });
    }
}));
exports.getAllFeedbacks = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.userId;
    console.log(userId);
    const result = yield (0, PredictionFeedbackService_1.getUserPredictionFeedbacks)(String(userId));
    return res.status(200).json(result);
}));
exports.getFeedbackStatus = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.user.userId;
        const planets = yield db_1.db.PredictionPlanet.findAll();
        if (planets.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No planets found'
            });
        }
        const planetStatuses = [];
        let totalSentencesAllPlanets = 0;
        let totalCompletedSentences = 0;
        let overallFeedbackCounts = {
            correct: 0,
            incorrect: 0,
            undecided: 0
        };
        for (const planetObj of planets) {
            const planetName = planetObj.planet_name;
            const savedPredictions = yield db_1.db.LifeTimePredictions.findAll({
                where: {
                    user_id: String(userId),
                    prediction_planet_id: planetObj.id
                },
                include: [
                    {
                        model: db_1.db.LifeTimePredictionCategory,
                        as: 'category',
                        attributes: ['id', 'name'],
                        where: {
                            name: {
                                [sequelize_1.default.Op.ne]: 'Verbal Location'
                            }
                        }
                    }
                ]
            });
            if (savedPredictions.length === 0) {
                continue;
            }
            const feedbacks = yield db_1.db.PredictionFeedback.findAll({
                where: {
                    user_id: String(userId),
                    prediction_planet_id: planetObj.id
                },
                include: [
                    {
                        model: db_1.db.LifeTimePredictionCategory,
                        as: 'category',
                        attributes: ['id', 'name']
                    }
                ]
            });
            const feedbackMap = new Map();
            feedbacks.forEach(fb => {
                var _a;
                const categoryName = (_a = fb.category) === null || _a === void 0 ? void 0 : _a.name;
                if (categoryName && categoryName !== 'Verbal Location') {
                    if (!feedbackMap.has(categoryName)) {
                        feedbackMap.set(categoryName, new Map());
                    }
                    feedbackMap.get(categoryName).set(fb.prediction_text, fb);
                }
            });
            const categoryStatuses = [];
            let planetTotalSentences = 0;
            let planetCompletedSentences = 0;
            for (const pred of savedPredictions) {
                const categoryName = pred.category.name;
                if (categoryName === 'Verbal Location') {
                    continue;
                }
                const predictionText = pred.predciton || '';
                const sentences = predictionText
                    .split(/\.(?=\s|$)/)
                    .map(s => s.trim())
                    .filter(s => s.length > 0)
                    .map(s => s.endsWith('.') ? s : `${s}.`);
                const categoryFeedbacks = feedbackMap.get(categoryName) || new Map();
                const sentenceStatuses = sentences.map(sentence => {
                    const feedback = categoryFeedbacks.get(sentence);
                    return {
                        sentence: sentence,
                        hasFeedback: !!feedback,
                        feedbackType: feedback === null || feedback === void 0 ? void 0 : feedback.feedback_type,
                        feedbackDate: feedback === null || feedback === void 0 ? void 0 : feedback.created_at
                    };
                });
                const completedInCategory = sentenceStatuses.filter(s => s.hasFeedback).length;
                const totalInCategory = sentenceStatuses.length;
                categoryStatuses.push({
                    category: categoryName,
                    totalSentences: totalInCategory,
                    completedSentences: completedInCategory,
                    remainingSentences: totalInCategory - completedInCategory,
                    completionPercentage: totalInCategory > 0
                        ? Math.round((completedInCategory / totalInCategory) * 100)
                        : 0,
                    sentences: sentenceStatuses
                });
                planetTotalSentences += totalInCategory;
                planetCompletedSentences += completedInCategory;
            }
            const planetFeedbackCounts = {
                correct: feedbacks.filter(f => f.feedback_type === 'correct').length,
                incorrect: feedbacks.filter(f => f.feedback_type === 'incorrect').length,
                undecided: feedbacks.filter(f => f.feedback_type === 'undecided').length
            };
            overallFeedbackCounts.correct += planetFeedbackCounts.correct;
            overallFeedbackCounts.incorrect += planetFeedbackCounts.incorrect;
            overallFeedbackCounts.undecided += planetFeedbackCounts.undecided;
            planetStatuses.push({
                planet: planetName,
                totalSentences: planetTotalSentences,
                completedSentences: planetCompletedSentences,
                remainingSentences: planetTotalSentences - planetCompletedSentences,
                completionPercentage: planetTotalSentences > 0
                    ? Math.round((planetCompletedSentences / planetTotalSentences) * 100)
                    : 0,
                isFullyCompleted: planetTotalSentences > 0 && planetCompletedSentences === planetTotalSentences,
                categories: categoryStatuses
            });
            totalSentencesAllPlanets += planetTotalSentences;
            totalCompletedSentences += planetCompletedSentences;
        }
        const overallStatus = {
            totalSentencesAllPlanets,
            totalCompletedSentences,
            totalRemainingSentences: totalSentencesAllPlanets - totalCompletedSentences,
            overallCompletionPercentage: totalSentencesAllPlanets > 0
                ? Math.round((totalCompletedSentences / totalSentencesAllPlanets) * 100)
                : 0,
            allPlanetsCompleted: totalSentencesAllPlanets > 0 && totalCompletedSentences === totalSentencesAllPlanets,
            feedbackSummary: overallFeedbackCounts,
            planets: planetStatuses
        };
        return res.status(200).json({
            success: true,
            message: 'Feedback status retrieved successfully',
            data: overallStatus
        });
    }
    catch (error) {
        console.error('Get feedback status error:', error);
        return res.status(500).json({
            success: false,
            message: error.message || 'Failed to retrieve feedback status'
        });
    }
}));
exports.getPlanetFeedbackStatus = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.user.userId;
        const planetName = req.params.planetName.charAt(0).toUpperCase() + req.params.planetName.slice(1);
        const planet = yield db_1.db.PredictionPlanet.findOne({
            where: { planet_name: planetName }
        });
        if (!planet) {
            return res.status(404).json({
                success: false,
                message: 'Planet not found'
            });
        }
        const savedPredictions = yield db_1.db.LifeTimePredictions.findAll({
            where: {
                user_id: String(userId),
                prediction_planet_id: planet.id
            },
            include: [
                {
                    model: db_1.db.LifeTimePredictionCategory,
                    as: 'category',
                    attributes: ['id', 'name'],
                    where: {
                        name: {
                            [sequelize_1.default.Op.ne]: 'Verbal Location'
                        }
                    }
                }
            ]
        });
        if (savedPredictions.length === 0) {
            return res.status(404).json({
                success: false,
                message: `No predictions found for ${planetName}`
            });
        }
        const feedbacks = yield db_1.db.PredictionFeedback.findAll({
            where: {
                user_id: String(userId),
                prediction_planet_id: planet.id
            },
            include: [
                {
                    model: db_1.db.LifeTimePredictionCategory,
                    as: 'category',
                    attributes: ['id', 'name']
                }
            ]
        });
        const feedbackMap = new Map();
        feedbacks.forEach(fb => {
            var _a;
            const categoryName = (_a = fb.category) === null || _a === void 0 ? void 0 : _a.name;
            if (categoryName && categoryName !== 'Verbal Location') {
                if (!feedbackMap.has(categoryName)) {
                    feedbackMap.set(categoryName, new Map());
                }
                feedbackMap.get(categoryName).set(fb.prediction_text, fb);
            }
        });
        const categoryStatuses = [];
        let planetTotalSentences = 0;
        let planetCompletedSentences = 0;
        for (const pred of savedPredictions) {
            const categoryName = pred.category.name;
            if (categoryName === 'Verbal Location') {
                continue;
            }
            const predictionText = pred.predciton || '';
            const sentences = predictionText
                .split(/\.(?=\s|$)/)
                .map(s => s.trim())
                .filter(s => s.length > 0)
                .map(s => s.endsWith('.') ? s : `${s}.`);
            const categoryFeedbacks = feedbackMap.get(categoryName) || new Map();
            const sentenceStatuses = sentences.map(sentence => {
                const feedback = categoryFeedbacks.get(sentence);
                return {
                    sentence: sentence,
                    hasFeedback: !!feedback,
                    feedbackType: feedback === null || feedback === void 0 ? void 0 : feedback.feedback_type,
                    feedbackDate: feedback === null || feedback === void 0 ? void 0 : feedback.created_at
                };
            });
            const completedInCategory = sentenceStatuses.filter(s => s.hasFeedback).length;
            const totalInCategory = sentenceStatuses.length;
            categoryStatuses.push({
                category: categoryName,
                totalSentences: totalInCategory,
                completedSentences: completedInCategory,
                remainingSentences: totalInCategory - completedInCategory,
                completionPercentage: totalInCategory > 0
                    ? Math.round((completedInCategory / totalInCategory) * 100)
                    : 0,
                sentences: sentenceStatuses
            });
            planetTotalSentences += totalInCategory;
            planetCompletedSentences += completedInCategory;
        }
        const planetStatus = {
            planet: planetName,
            totalSentences: planetTotalSentences,
            completedSentences: planetCompletedSentences,
            remainingSentences: planetTotalSentences - planetCompletedSentences,
            completionPercentage: planetTotalSentences > 0
                ? Math.round((planetCompletedSentences / planetTotalSentences) * 100)
                : 0,
            isFullyCompleted: planetTotalSentences > 0 && planetCompletedSentences === planetTotalSentences,
            categories: categoryStatuses
        };
        return res.status(200).json({
            success: true,
            message: `Feedback status for ${planetName} retrieved successfully`,
            data: planetStatus
        });
    }
    catch (error) {
        console.error('Get planet feedback status error:', error);
        return res.status(500).json({
            success: false,
            message: error.message || 'Failed to retrieve feedback status'
        });
    }
}));
