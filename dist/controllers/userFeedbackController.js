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
exports.hanndleFeedback = hanndleFeedback;
exports.getCurrentFeedbackStatus = getCurrentFeedbackStatus;
const models_1 = require("../db/models");
const sequelize_1 = require("../db/sequelize");
const sequelize_2 = require("sequelize");
function hanndleFeedback(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        try {
            const { planet, text, cat, status } = req.body;
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
            if (!userId) {
                return res.status(401).json({ error: "User not authenticated" });
            }
            const feedbackStatus = status === 'correct' ? '2' : status === 'incorrect' ? '1' : '0';
            const category = yield models_1.Predictioncategory.findOne({
                where: { name: cat }
            });
            if (!category) {
                return res.status(404).json({ error: "Category not found" });
            }
            const predictionPlanet = yield models_1.PredictionPlanet.findOne({
                where: { PlanetName: planet }
            });
            if (!predictionPlanet) {
                return res.status(404).json({ error: "Planet not found" });
            }
            let predictionItem = yield models_1.PredictionItems.findOne({
                where: {
                    itemName: text,
                    predcitonCatId: category.id,
                    PredictionPlanetId: predictionPlanet.id
                }
            });
            if (!predictionItem) {
                predictionItem = yield models_1.PredictionItems.create({
                    itemName: text,
                    predcitonCatId: category.id,
                    PredictionPlanetId: Number(predictionPlanet.id),
                    feedback: '0'
                });
            }
            const existingFeedback = yield models_1.UserFeedback.findOne({
                where: {
                    userId: userId,
                    PredictionItemId: predictionItem.id
                }
            });
            if (existingFeedback) {
                return res.status(400).json({
                    error: "You have already provided feedback for this item",
                    key: `${planet}-${text}-${cat}`
                });
            }
            yield models_1.UserFeedback.create({
                userId: Number(userId),
                PredictionItemId: predictionItem.id
            });
            yield predictionItem.update({
                feedback: feedbackStatus
            });
            const key = `${planet}-${text}-${cat}`;
            res.json({
                success: true,
                status: status,
                key: key,
                message: "Feedback submitted successfully"
            });
        }
        catch (error) {
            console.error("hanndleFeedback:", error);
            return res.status(500).json({ error: "Server error" });
        }
    });
}
function getCurrentFeedbackStatus(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        try {
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
            if (!userId) {
                return res.status(401).json({ error: "User not authenticated" });
            }
            const query = `
       SELECT 
                uf.id as feedback_id,
                pi.id as item_id,
                pi."itemName" as text,
                pi.feedback as feedback_value,
                pc.name as category_name,
                pp."PlanetName" as planet_name
            FROM user_feedback as uf
            INNER JOIN prediction_items pi ON uf."PredictionItemId" = pi.id
            INNER JOIN prediction_category pc ON pi."predcitonCatId" = pc.id
            INNER JOIN prediction_planet pp ON pi."PredictionPlanetId" = pp.id
            WHERE uf."userId" = 1
            ORDER BY uf.id DESC
        `;
            const results = yield sequelize_1.sequelize.query(query, {
                replacements: { userId: userId },
                type: sequelize_2.QueryTypes.SELECT
            });
            const feedbackData = results.map((row) => {
                return {
                    key: `${row.planet_name}-${row.text}-${row.category_name}`,
                    planet: row.planet_name,
                    text: row.text,
                    cat: row.category_name,
                    status: row.feedback_value === '2' ? 'correct' :
                        row.feedback_value === '1' ? 'incorrect' : 'Undecided',
                    feedbackValue: row.feedback_value
                };
            });
            res.json({
                success: true,
                count: feedbackData.length,
                feedbacks: feedbackData
            });
        }
        catch (error) {
            console.error("getCurrentFeedbackStatus:", error);
            return res.status(500).json({ error: "Server error" });
        }
    });
}
