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
exports.getUserPredictionFeedbacks = exports.savePredictionFeedback = void 0;
const db_1 = require("../db");
const savePredictionFeedback = (userId, planet, category, predictionText, feedbackType) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const planetRecord = yield db_1.db.PredictionPlanet.findOne({
            where: { planet_name: planet }
        });
        if (!planetRecord) {
            throw new Error(`Planet ${planet} not found`);
        }
        function capitalizeFirstLetter(str) {
            if (str.length === 0)
                return str;
            return str.charAt(0).toUpperCase() + str.slice(1);
        }
        const catname = category == "zodiac" ? "Planet " + capitalizeFirstLetter(category) + " Prediction" : capitalizeFirstLetter(category) + " Prediction";
        const categoryRecord = yield db_1.db.LifeTimePredictionCategory.findOne({
            where: { name: catname }
        });
        if (!categoryRecord) {
            throw new Error(`Category ${category} not found`);
        }
        const [feedback, created] = yield db_1.db.PredictionFeedback.findOrCreate({
            where: {
                user_id: String(userId),
                prediction_planet_id: planetRecord.id,
                life_time_prediction_category_id: categoryRecord.id,
                prediction_text: predictionText
            },
            defaults: {
                user_id: String(userId),
                prediction_planet_id: planetRecord.id,
                life_time_prediction_category_id: categoryRecord.id,
                prediction_text: predictionText,
                feedback_type: feedbackType,
            }
        });
        return {
            success: true,
            message: created ? 'Feedback saved successfully' : 'Feedback updated successfully',
            data: {
                id: feedback.id,
                feedback_type: feedback.feedback_type,
                created: created
            }
        };
    }
    catch (error) {
        console.error('Error saving prediction feedback:', error);
        throw new Error(`Failed to save feedback: ${error.message}`);
    }
});
exports.savePredictionFeedback = savePredictionFeedback;
const getUserPredictionFeedbacks = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const feedbacks = yield db_1.db.PredictionFeedback.findAll({
            where: {
                user_id: userId,
            },
            include: [
                {
                    model: db_1.db.PredictionPlanet,
                    as: 'planet',
                    attributes: ['id', 'planet_name'],
                },
                {
                    model: db_1.db.LifeTimePredictionCategory,
                    as: 'category',
                    attributes: ['id', 'name'],
                },
            ],
            order: [['created_at', 'DESC']],
        });
        const formattedFeedbacks = feedbacks.map((feedback) => {
            var _a, _b;
            const categoryName = ((_a = feedback.category) === null || _a === void 0 ? void 0 : _a.name) || '';
            const categoryFormat = categoryName === 'Personalised Prediction'
                ? 'personalised'
                : categoryName === 'General Prediction'
                    ? 'general'
                    : 'zodiac';
            const key = `${((_b = feedback.planet) === null || _b === void 0 ? void 0 : _b.planet_name) || 'N/A'}-${feedback.prediction_text || 'N/A'}-${categoryFormat}`;
            return {
                idx: key,
                feedbackStatus: feedback.feedback_type,
            };
        });
        return {
            success: true,
            data: formattedFeedbacks,
            message: 'Feedbacks retrieved successfully',
            count: formattedFeedbacks.length,
        };
    }
    catch (error) {
        console.error('Error getting feedbacks:', error);
        throw new Error(`Failed to get feedbacks: ${error.message}`);
    }
});
exports.getUserPredictionFeedbacks = getUserPredictionFeedbacks;
