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
exports.PlanetHouse = PlanetHouse;
exports.Mahadasha = Mahadasha;
exports.AntharDasha = AntharDasha;
exports.Navamsaka = Navamsaka;
exports.AstrologicalDetails = AstrologicalDetails;
const savePlanetHouse_1 = require("../utils/seveFunctions/savePlanetHouse");
const env_1 = require("../config/env");
const astrologyParams_1 = require("../utils/astrologyParams");
const mahadashaSeve_1 = require("../utils/seveFunctions/mahadashaSeve");
const anthardashaSeve_1 = require("../utils/seveFunctions/anthardashaSeve");
const seveNavamsakaData_1 = require("../utils/seveFunctions/seveNavamsakaData");
const db_1 = require("../db");
const sequelize_1 = require("sequelize");
const saveAstrologic_1 = require("../utils/seveFunctions/saveAstrologic");
function getExistingPlanetHouse(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        const savedRecord = yield db_1.db.PalentHouse.findOne({
            where: { userId: String(userId) },
        });
        if (!savedRecord) {
            return null;
        }
        const formatBox = (value) => {
            if (!value)
                return [];
            return value.split(",").filter(Boolean);
        };
        const responseData = {
            lagnaya: savedRecord.lagnaya,
            box1: formatBox(savedRecord.box1 || ""),
            box2: formatBox(savedRecord.box2 || ""),
            box3: formatBox(savedRecord.box3 || ""),
            box4: formatBox(savedRecord.box4 || ""),
            box5: formatBox(savedRecord.box5 || ""),
            box6: formatBox(savedRecord.box6 || ""),
            box7: formatBox(savedRecord.box7 || ""),
            box8: formatBox(savedRecord.box8 || ""),
            box9: formatBox(savedRecord.box9 || ""),
            box10: formatBox(savedRecord.box10 || ""),
            box11: formatBox(savedRecord.box11 || ""),
            box12: formatBox(savedRecord.box12 || ""),
        };
        return {
            success: true,
            data: responseData,
            message: "Planet house data retrieved successfully",
        };
    });
}
function getExistingNavamsaka(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        const savedRecord = yield db_1.db.Navamsaka.findOne({
            where: { userId: String(userId) },
        });
        if (!savedRecord) {
            return null;
        }
        const formatBox = (value) => {
            if (!value)
                return [];
            return value.split(",").filter(Boolean);
        };
        const responseData = {
            lagnaya: savedRecord.lagnaya,
            box1: formatBox(savedRecord.box1 || ""),
            box2: formatBox(savedRecord.box2 || ""),
            box3: formatBox(savedRecord.box3 || ""),
            box4: formatBox(savedRecord.box4 || ""),
            box5: formatBox(savedRecord.box5 || ""),
            box6: formatBox(savedRecord.box6 || ""),
            box7: formatBox(savedRecord.box7 || ""),
            box8: formatBox(savedRecord.box8 || ""),
            box9: formatBox(savedRecord.box9 || ""),
            box10: formatBox(savedRecord.box10 || ""),
            box11: formatBox(savedRecord.box11 || ""),
            box12: formatBox(savedRecord.box12 || ""),
        };
        return {
            success: true,
            data: responseData,
            message: "Navamsaka data retrieved successfully",
        };
    });
}
function getExistingDasha(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        const savedRecords = yield db_1.db.DashaBalance.findAll({
            where: { userId: String(userId) },
            order: [['From', 'ASC']]
        });
        if (savedRecords.length !== 9) {
            return null;
        }
        const currentDate = new Date();
        const currentDateStr = currentDate.toISOString().split('T')[0];
        let currentDasha = null;
        let currentMahadashaSet = null;
        let currentIndex = -1;
        for (let i = 0; i < savedRecords.length; i++) {
            const record = savedRecords[i];
            if (currentDateStr >= record.From && currentDateStr < record.To) {
                currentDasha = {
                    dasha: record.dashawa,
                    from: record.From,
                    to: record.To
                };
                currentIndex = i;
                break;
            }
        }
        if (currentIndex !== -1) {
            currentMahadashaSet = [];
            const currentRecord = savedRecords[currentIndex];
            currentMahadashaSet.push({
                dasha: currentRecord.dashawa,
                from: currentRecord.From,
                to: currentRecord.To
            });
            if (currentIndex + 1 < savedRecords.length) {
                const nextRecord = savedRecords[currentIndex + 1];
                currentMahadashaSet.push({
                    dasha: nextRecord.dashawa,
                    from: nextRecord.From,
                    to: nextRecord.To
                });
            }
        }
        return {
            success: true,
            data: {
                current_dasha: currentDasha,
                current_mahadasha_set: currentMahadashaSet,
            },
            message: "Dasha data retrieved successfully",
        };
    });
}
function getExistingAntardasha(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        const antarRecords = yield db_1.db.AntharDasha.findAll({
            where: { userId: String(userId) },
        });
        if (antarRecords.length !== 81) {
            return null;
        }
        const today = new Date().toISOString().split('T')[0];
        const currentAntardasha = yield db_1.db.AntharDasha.findOne({
            where: {
                userId: String(userId),
                From: { [sequelize_1.Op.lte]: today },
                To: { [sequelize_1.Op.gte]: today },
            },
        });
        let currentSetData = null;
        if (currentAntardasha) {
            const currentSetNo = currentAntardasha.setNo;
            const currentSet = yield db_1.db.AntharDasha.findAll({
                where: {
                    userId: String(userId),
                    setNo: currentSetNo
                },
                order: [['From', 'ASC']],
            });
            currentSetData = currentSet.map(rec => ({
                anthardhashawa: rec.anthardhashawa,
                from: rec.From,
                to: rec.To
            }));
        }
        return {
            success: true,
            data: {
                total_antardashas_saved: antarRecords.length,
                current_antardasha: currentAntardasha ? {
                    anthardhashawa: currentAntardasha.anthardhashawa,
                    setNo: currentAntardasha.setNo,
                    from: currentAntardasha.From,
                    to: currentAntardasha.To,
                } : null,
                current_antardasha_set: currentSetData,
            },
            message: "Antardasha data retrieved successfully",
        };
    });
}
function PlanetHouse(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { userId } = yield (0, astrologyParams_1.getAstrologyApiParams)(req.user.userId || "");
            const existing = yield getExistingPlanetHouse(userId);
            if (existing) {
                return res.json({
                    success: true,
                    message: "Horoscope retrieved from database successfully",
                    result: existing
                });
            }
            const { params } = yield (0, astrologyParams_1.getAstrologyApiParams)(req.user.userId || "");
            const apiUrl = `${env_1.env.planetHouseApiUrl}?${params}`;
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
            const result = yield (0, savePlanetHouse_1.savePlanetHouseFromApi)(userId, data);
            return res.json({
                success: true,
                message: "Horoscope generated and saved successfully",
                result
            });
        }
        catch (error) {
            console.error('Error in /planetHouse route:', error);
            return res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    });
}
function Mahadasha(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { userId } = yield (0, astrologyParams_1.getAstrologyApiParams)(req.user.userId || "");
            const existing = yield getExistingDasha(userId);
            if (existing) {
                return res.json({
                    success: true,
                    message: "Mahadasha retrieved from database successfully",
                    result: existing
                });
            }
            const { params } = yield (0, astrologyParams_1.getAstrologyApiParams)(req.user.userId || "");
            const apiUrl = `${env_1.env.mahadashaApiUrl}?${params}`;
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
            const result = yield (0, mahadashaSeve_1.saveDashaFromApi)(userId, data);
            return res.json({
                success: true,
                message: "Horoscope generated and saved successfully",
                result
            });
        }
        catch (error) {
            console.error('Error in /mahadasha route:', error);
            return res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    });
}
function AntharDasha(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { userId } = yield (0, astrologyParams_1.getAstrologyApiParams)(req.user.userId || "");
            const existing = yield getExistingAntardasha(userId);
            if (existing) {
                return res.json({
                    success: true,
                    message: "Anthar Dasha retrieved from database successfully",
                    result: existing
                });
            }
            const { params } = yield (0, astrologyParams_1.getAstrologyApiParams)(req.user.userId || "");
            const apiUrl = `${env_1.env.antharDashaApiUrl}?${params}`;
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
            const result = yield (0, anthardashaSeve_1.saveAntardashaFromApi)(userId, data);
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
function Navamsaka(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { userId } = yield (0, astrologyParams_1.getAstrologyApiParams)(req.user.userId || "", "", true);
            const existing = yield getExistingNavamsaka(userId);
            if (existing) {
                return res.json({
                    success: true,
                    message: "navamshaka retrieved from database successfully",
                    result: existing
                });
            }
            const { params } = yield (0, astrologyParams_1.getAstrologyApiParams)(req.user.userId || "", "", true);
            const apiUrl = `${env_1.env.navamApi}?${params}`;
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
            const result = yield (0, seveNavamsakaData_1.saveNavamsakaFromApi)(userId, data);
            return res.json({
                success: true,
                message: "navamshaka generated and saved successfully",
                result
            });
        }
        catch (error) {
            console.error('Error in /navamshaka route:', error);
            return res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    });
}
function getExistingAstrologicalDetails(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        const savedRecord = yield db_1.db.AstrologicalDetails.findOne({
            where: { userId: String(userId) },
        });
        if (!savedRecord) {
            return null;
        }
        const responseData = {
            gana: savedRecord.gana,
            yoni: savedRecord.yoni,
            vasya: savedRecord.vasya,
            nadi: savedRecord.nadi,
            varna: savedRecord.varna,
            paya: savedRecord.paya,
            paya_by_nakshatra: savedRecord.paya_by_nakshatra,
            tatva: savedRecord.tatva,
            life_stone: savedRecord.life_stone,
            lucky_stone: savedRecord.lucky_stone,
            fortune_stone: savedRecord.fortune_stone,
            name_start: savedRecord.name_start,
            ascendant_sign: savedRecord.ascendant_sign,
            ascendant_nakshatra: savedRecord.ascendant_nakshatra,
            rasi: savedRecord.rasi,
            rasi_lord: savedRecord.rasi_lord,
            nakshatra: savedRecord.nakshatra,
            nakshatra_lord: savedRecord.nakshatra_lord,
            nakshatra_pada: savedRecord.nakshatra_pada,
            sun_sign: savedRecord.sun_sign,
            tithi: savedRecord.tithi,
            karana: savedRecord.karana,
            yoga: savedRecord.yoga,
            ayanamsa: savedRecord.ayanamsa,
        };
        return {
            success: true,
            data: responseData,
            message: "Astrological details retrieved successfully",
        };
    });
}
function AstrologicalDetails(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { userId } = yield (0, astrologyParams_1.getAstrologyApiParams)(req.user.userId || "");
            const existing = yield getExistingAstrologicalDetails(userId);
            if (existing) {
                return res.json({
                    success: true,
                    message: "Astrological details retrieved from database successfully",
                    result: existing
                });
            }
            const { params } = yield (0, astrologyParams_1.getAstrologyApiParams)(req.user.userId || "");
            const apiUrl = `${env_1.env.astrologic}?${params}`;
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
            const result = yield (0, saveAstrologic_1.saveAstrologicalDetailsFromApi)(userId, data);
            return res.json({
                success: true,
                message: "Astrological details generated and saved successfully",
                result
            });
        }
        catch (error) {
            console.error('Error in /astrologicalDetails route:', error);
            return res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    });
}
