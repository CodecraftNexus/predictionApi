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
exports.sunPrediction = sunPrediction;
const env_1 = require("../config/env");
const astrologyParams_1 = require("../utils/astrologyParams");
const sunPredictionSeve_1 = require("../utils/sunPredictionSeve");
function sunPrediction(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { paramsPredictionSun, userId } = yield (0, astrologyParams_1.getAstrologyApiParams)(req.user.userId || "");
            const apiUrl = `${env_1.env.predictionApiUrl}?${paramsPredictionSun}`;
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
            const result = yield (0, sunPredictionSeve_1.saveSunPredictionFromApi)(userId, data);
            return res.json({
                success: true,
                message: "Anthar Dasha generated and saved successfully",
                result
            });
        }
        catch (error) {
            console.error('Error in /anthardhasha route:', error);
            return res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    });
}
