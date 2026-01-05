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
exports.deletePlanetLocationPrediction = exports.updatePlanetLocationPrediction = exports.getPredictionById = exports.getAllPredictions = exports.getPredictionByDetails = exports.createPlanetLocationPrediction = void 0;
const planetLocatinsPredictins_1 = require("../db/models/planetLocatinsPredictins");
const PredictionPlanet_1 = require("../db/models/PredictionPlanet");
const asyncHandler_1 = require("../utils/asyncHandler");
exports.createPlanetLocationPrediction = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { lagnaya, PredictionPlanetId, planetlocation, prediction } = req.body;
    if (!lagnaya || !PredictionPlanetId || !planetlocation || !prediction) {
        return res.status(400).json({
            success: false,
            message: "All fields are required (lagnaya, PredictionPlanetId, planetlocation, prediction)"
        });
    }
    const planet = yield PredictionPlanet_1.PredictionPlanet.findByPk(PredictionPlanetId);
    if (!planet) {
        return res.status(404).json({
            success: false,
            message: "Planet not found"
        });
    }
    const newPrediction = yield planetLocatinsPredictins_1.planetLocatinsPredictins.create({
        lagnaya,
        prediction_planet_id: PredictionPlanetId,
        planet_location: planetlocation,
        prediction
    });
    return res.status(201).json({
        success: true,
        message: "Planet location prediction created successfully",
        data: newPrediction
    });
}));
exports.getPredictionByDetails = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { lagnaya, planetId, planetlocation } = req.query;
    if (!lagnaya || !planetId || !planetlocation) {
        return res.status(400).json({
            success: false,
            message: "lagnaya, planetId, and planetlocation are required"
        });
    }
    const prediction = yield planetLocatinsPredictins_1.planetLocatinsPredictins.findOne({
        where: {
            lagnaya: lagnaya,
            prediction_planet_id: Number(planetId),
            planet_location: planetlocation
        },
        include: [
            {
                model: PredictionPlanet_1.PredictionPlanet,
                as: "predictionPlanet",
                attributes: ["id", "planet_name"]
            }
        ]
    });
    if (!prediction) {
        return res.status(404).json({
            success: false,
            message: "Prediction not found for the given details"
        });
    }
    return res.status(200).json({
        success: true,
        data: prediction
    });
}));
exports.getAllPredictions = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { lagnaya, planetId, planetlocation } = req.query;
    const whereClause = {};
    if (lagnaya)
        whereClause.lagnaya = lagnaya;
    if (planetId)
        whereClause.PredictionPlanetId = Number(planetId);
    if (planetlocation)
        whereClause.planetlocation = planetlocation;
    const predictions = yield planetLocatinsPredictins_1.planetLocatinsPredictins.findAll({
        where: whereClause,
        include: [
            {
                model: PredictionPlanet_1.PredictionPlanet,
                as: "predictionPlanet",
                attributes: ["id", "planet_name"]
            }
        ],
        order: [["id", "ASC"]]
    });
    return res.status(200).json({
        success: true,
        count: predictions.length,
        data: predictions
    });
}));
exports.getPredictionById = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const prediction = yield planetLocatinsPredictins_1.planetLocatinsPredictins.findByPk(id, {
        include: [
            {
                model: PredictionPlanet_1.PredictionPlanet,
                as: "predictionPlanet",
                attributes: ["id", "planet_name"]
            }
        ]
    });
    if (!prediction) {
        return res.status(404).json({
            success: false,
            message: "Prediction not found"
        });
    }
    return res.status(200).json({
        success: true,
        data: prediction
    });
}));
exports.updatePlanetLocationPrediction = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { lagnaya, PredictionPlanetId, planetlocation, prediction } = req.body;
    const existingPrediction = yield planetLocatinsPredictins_1.planetLocatinsPredictins.findByPk(id);
    if (!existingPrediction) {
        return res.status(404).json({
            success: false,
            message: "Prediction not found"
        });
    }
    if (PredictionPlanetId) {
        const planet = yield PredictionPlanet_1.PredictionPlanet.findByPk(PredictionPlanetId);
        if (!planet) {
            return res.status(404).json({
                success: false,
                message: "Planet not found"
            });
        }
    }
    const updateData = {};
    if (lagnaya !== undefined)
        updateData.lagnaya = lagnaya;
    if (PredictionPlanetId !== undefined)
        updateData.PredictionPlanetId = PredictionPlanetId;
    if (planetlocation !== undefined)
        updateData.planetlocation = planetlocation;
    if (prediction !== undefined)
        updateData.prediction = prediction;
    yield existingPrediction.update(updateData);
    const updatedPrediction = yield planetLocatinsPredictins_1.planetLocatinsPredictins.findByPk(id, {
        include: [
            {
                model: PredictionPlanet_1.PredictionPlanet,
                as: "predictionPlanet",
                attributes: ["id", "planet_name"]
            }
        ]
    });
    return res.status(200).json({
        success: true,
        message: "Prediction updated successfully",
        data: updatedPrediction
    });
}));
exports.deletePlanetLocationPrediction = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const prediction = yield planetLocatinsPredictins_1.planetLocatinsPredictins.findByPk(id);
    if (!prediction) {
        return res.status(404).json({
            success: false,
            message: "Prediction not found"
        });
    }
    yield prediction.destroy();
    return res.status(200).json({
        success: true,
        message: "Prediction deleted successfully"
    });
}));
