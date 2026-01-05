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
exports.AntharDasha = exports.Mahadasha = exports.Navanshaka = exports.PlanetHouse = exports.planetsMaps = void 0;
exports.getExistingPlanetHouse = getExistingPlanetHouse;
exports.getExistingNavanshaka = getExistingNavanshaka;
exports.getExistingMahaDasha = getExistingMahaDasha;
exports.getExistingAntardasha = getExistingAntardasha;
exports.getExistingAstrologicalDetails = getExistingAstrologicalDetails;
exports.AstrologicalDetails = AstrologicalDetails;
const planetMaps_1 = require("./../utils/translation/planetMaps");
const env_1 = require("../config/env");
const db_1 = require("../db");
const asyncHandler_1 = require("../utils/asyncHandler");
const astrologyParams_1 = require("../utils/astrologyParams");
const SevePlanetHouse_1 = require("../utils/SeveFunctions/SevePlanetHouse");
const SaveNavanshakaData_1 = require("../utils/SeveFunctions/SaveNavanshakaData");
const sequelize_1 = require("sequelize");
const anthardashaSeve_1 = require("../utils/SeveFunctions/anthardashaSeve");
const MahadashaSeve_1 = require("../utils/SeveFunctions/MahadashaSeve");
const saveAstrologic_1 = require("../utils/SeveFunctions/saveAstrologic");
exports.planetsMaps = {
    en: {
        "Sun": "Sun",
        "Moon": "Moon",
        "Mars": "Mars",
        "Mercury": "Mercury",
        "Jupiter": "Jupiter",
        "Venus": "Venus",
        "Saturn": "Saturn",
        "Rahu": "Rahu",
        "Ketu": "Ketu",
        "Ascendant": "Asc"
    },
    si: {
        "Sun": "රවි",
        "Moon": "චන්ද්‍ර",
        "Mars": "කුජ",
        "Mercury": "බුධ",
        "Jupiter": "ගුරු",
        "Venus": "ශුක්‍ර",
        "Saturn": "ශනි",
        "Rahu": "රාහු",
        "Ketu": "කේතු",
        "Ascendant": "ලග්නය"
    },
    ta: {
        "Sun": "சூரியன்",
        "Moon": "சந்திரன்",
        "Mars": "செவ்வாய்",
        "Mercury": "புதன்",
        "Jupiter": "குரு",
        "Venus": "சுக்ரன்",
        "Saturn": "சனி",
        "Rahu": "ராகு",
        "Ketu": "கேது",
        "Ascendant": "லக்னம்"
    }
};
function getExistingPlanetHouse(userId_1) {
    return __awaiter(this, arguments, void 0, function* (userId, language = 'en', isLLM) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
        const savedRecord = yield db_1.db.PlanetHouse.findOne({
            where: { user_id: String(userId) },
        });
        if (!savedRecord) {
            return null;
        }
        const convertToLanguage = (value) => {
            if (!value)
                return [];
            const englishAbbrevMap = {
                "Su": "Sun",
                "Mo": "Moon",
                "Ma": "Mars",
                "Me": "Mercury",
                "Ju": "Jupiter",
                "Ve": "Venus",
                "Sa": "Saturn",
                "Ra": "Rahu",
                "Ke": "Ketu"
            };
            return value.split(",")
                .filter(Boolean)
                .map(abbrev => {
                const fullName = englishAbbrevMap[abbrev];
                return planetMaps_1.planetMaps[language][fullName] || abbrev;
            })
                .filter(Boolean);
        };
        const convertZodiacToLanguage = (englishZodiac) => {
            return planetMaps_1.zodiacMaps[language][englishZodiac] || englishZodiac;
        };
        const responseData = {
            lagnaya: convertZodiacToLanguage(savedRecord.lagnaya),
            box1: convertToLanguage((_a = savedRecord.box1) !== null && _a !== void 0 ? _a : null),
            box2: convertToLanguage((_b = savedRecord.box2) !== null && _b !== void 0 ? _b : null),
            box3: convertToLanguage((_c = savedRecord.box3) !== null && _c !== void 0 ? _c : null),
            box4: convertToLanguage((_d = savedRecord.box4) !== null && _d !== void 0 ? _d : null),
            box5: convertToLanguage((_e = savedRecord.box5) !== null && _e !== void 0 ? _e : null),
            box6: convertToLanguage((_f = savedRecord.box6) !== null && _f !== void 0 ? _f : null),
            box7: convertToLanguage((_g = savedRecord.box7) !== null && _g !== void 0 ? _g : null),
            box8: convertToLanguage((_h = savedRecord.box8) !== null && _h !== void 0 ? _h : null),
            box9: convertToLanguage((_j = savedRecord.box9) !== null && _j !== void 0 ? _j : null),
            box10: convertToLanguage((_k = savedRecord.box10) !== null && _k !== void 0 ? _k : null),
            box11: convertToLanguage((_l = savedRecord.box11) !== null && _l !== void 0 ? _l : null),
            box12: convertToLanguage((_m = savedRecord.box12) !== null && _m !== void 0 ? _m : null),
        };
        if (isLLM) {
            return responseData;
        }
        else {
            return {
                success: true,
                data: responseData,
                message: "Planet house data retrieved successfully",
            };
        }
    });
}
exports.PlanetHouse = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = yield (0, astrologyParams_1.getAstrologyApiParams)(req.user.userId || "");
    const user = yield db_1.db.Users.findByPk(userId, {
        include: [{
                model: db_1.db.Language,
                attributes: ['id', 'name'],
            }]
    });
    const userWithRelations = user;
    const language = ['en', 'ta', 'si'].includes(userWithRelations.Language.name) ? userWithRelations.Language.name : "en";
    const existing = yield getExistingPlanetHouse(userId, language, false);
    if (existing) {
        return res.json({
            success: true,
            message: "Horoscope retrieved from database successfully",
            result: existing
        });
    }
    const { params } = yield (0, astrologyParams_1.getAstrologyApiParams)(req.user.userId || "");
    const apiUrl = `${env_1.env.PLANET_HOUSE_API_URL}?${params}`;
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
    const result = yield (0, SevePlanetHouse_1.savePlanetHouseFromApi)(userId, data, language);
    return res.json({
        success: true,
        message: "Horoscope generated and saved successfully",
        result
    });
}));
function getExistingNavanshaka(userId_1) {
    return __awaiter(this, arguments, void 0, function* (userId, language = 'en', isLLM) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
        const savedRecord = yield db_1.db.Navanshaka.findOne({
            where: { user_id: String(userId) },
        });
        if (!savedRecord) {
            return null;
        }
        const convertToLanguage = (value) => {
            if (!value)
                return [];
            const englishAbbrevMap = {
                "Su": "Sun",
                "Mo": "Moon",
                "Ma": "Mars",
                "Me": "Mercury",
                "Ju": "Jupiter",
                "Ve": "Venus",
                "Sa": "Saturn",
                "Ra": "Rahu",
                "Ke": "Ketu"
            };
            return value.split(",")
                .filter(Boolean)
                .map(abbrev => {
                const fullName = englishAbbrevMap[abbrev];
                return planetMaps_1.planetMaps[language][fullName] || abbrev;
            })
                .filter(Boolean);
        };
        const convertZodiacToLanguage = (englishZodiac) => {
            return planetMaps_1.zodiacMaps[language][englishZodiac] || englishZodiac;
        };
        const responseData = {
            lagnaya: convertZodiacToLanguage(savedRecord.lagnaya),
            box1: convertToLanguage((_a = savedRecord.box1) !== null && _a !== void 0 ? _a : null),
            box2: convertToLanguage((_b = savedRecord.box2) !== null && _b !== void 0 ? _b : null),
            box3: convertToLanguage((_c = savedRecord.box3) !== null && _c !== void 0 ? _c : null),
            box4: convertToLanguage((_d = savedRecord.box4) !== null && _d !== void 0 ? _d : null),
            box5: convertToLanguage((_e = savedRecord.box5) !== null && _e !== void 0 ? _e : null),
            box6: convertToLanguage((_f = savedRecord.box6) !== null && _f !== void 0 ? _f : null),
            box7: convertToLanguage((_g = savedRecord.box7) !== null && _g !== void 0 ? _g : null),
            box8: convertToLanguage((_h = savedRecord.box8) !== null && _h !== void 0 ? _h : null),
            box9: convertToLanguage((_j = savedRecord.box9) !== null && _j !== void 0 ? _j : null),
            box10: convertToLanguage((_k = savedRecord.box10) !== null && _k !== void 0 ? _k : null),
            box11: convertToLanguage((_l = savedRecord.box11) !== null && _l !== void 0 ? _l : null),
            box12: convertToLanguage((_m = savedRecord.box12) !== null && _m !== void 0 ? _m : null),
        };
        if (isLLM) {
            return responseData;
        }
        else {
            return {
                success: true,
                data: responseData,
                message: "Navamsaka data retrieved successfully",
            };
        }
    });
}
exports.Navanshaka = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = yield (0, astrologyParams_1.getAstrologyApiParams)(req.user.userId || "", "", true);
    const user = yield db_1.db.Users.findByPk(userId, {
        include: [{
                model: db_1.db.Language,
                attributes: ['id', 'name'],
            }]
    });
    const userWithRelations = user;
    const language = ['en', 'ta', 'si'].includes(userWithRelations.Language.name) ? userWithRelations.Language.name : "en";
    const existing = yield getExistingNavanshaka(userId, language, false);
    if (existing) {
        return res.json({
            success: true,
            message: "Navanshaka retrieved from database successfully",
            result: existing
        });
    }
    const { params } = yield (0, astrologyParams_1.getAstrologyApiParams)(req.user.userId || "", "", true);
    const apiUrl = `${env_1.env.NAVANSHAKA_API_URL}?${params}`;
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
    const result = yield (0, SaveNavanshakaData_1.saveNavanshakaFromApi)(userId, data, language);
    return res.json({
        success: true,
        message: "Navanshaka generated and saved successfully",
        result
    });
}));
function getExistingMahaDasha(userId_1) {
    return __awaiter(this, arguments, void 0, function* (userId, language = 'en', isLLM) {
        const savedRecords = yield db_1.db.Mahadahsha.findAll({
            where: { user_id: String(userId) },
            order: [['from', 'ASC']]
        });
        if (!savedRecords || savedRecords.length === 0) {
            return null;
        }
        const convertPlanetToLanguage = (abbrev) => {
            return exports.planetsMaps[language][abbrev] || abbrev;
        };
        const currentDate = new Date();
        const currentDateStr = currentDate.toISOString().split('T')[0];
        let currentDasha = null;
        let currentMahadashaSet = null;
        let currentIndex = -1;
        for (let i = 0; i < savedRecords.length; i++) {
            const record = savedRecords[i];
            if (currentDateStr >= record.from && currentDateStr < record.to) {
                currentDasha = {
                    dasha: convertPlanetToLanguage(record.dashawa),
                    from: record.from,
                    to: record.to
                };
                currentIndex = i;
                break;
            }
        }
        if (currentIndex !== -1) {
            currentMahadashaSet = [];
            const currentRecord = savedRecords[currentIndex];
            currentMahadashaSet.push({
                dasha: convertPlanetToLanguage(currentRecord.dashawa),
                from: currentRecord.from,
                to: currentRecord.to
            });
            if (currentIndex + 1 < savedRecords.length) {
                const nextRecord = savedRecords[currentIndex + 1];
                currentMahadashaSet.push({
                    dasha: convertPlanetToLanguage(nextRecord.dashawa),
                    from: nextRecord.from,
                    to: nextRecord.to
                });
            }
        }
        const allDashas = savedRecords.map(record => ({
            dasha: convertPlanetToLanguage(record.dashawa),
            from: record.from,
            to: record.to
        }));
        const responseData = {
            current_dasha: currentDasha,
            current_mahadasha_set: currentMahadashaSet,
            all_dashas: allDashas
        };
        if (isLLM) {
            return responseData;
        }
        else {
            return {
                success: true,
                data: responseData,
                message: "Dasha data retrieved successfully",
            };
        }
    });
}
;
exports.Mahadasha = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = yield (0, astrologyParams_1.getAstrologyApiParams)(req.user.userId || "");
    const user = yield db_1.db.Users.findByPk(userId, {
        include: [{
                model: db_1.db.Language,
                attributes: ['id', 'name'],
            }]
    });
    const userWithRelations = user;
    const language = ['en', 'ta', 'si'].includes(userWithRelations.Language.name) ? userWithRelations.Language.name : "en";
    const existing = yield getExistingMahaDasha(userId, language);
    if (existing) {
        return res.json({
            success: true,
            message: "Mahadasha retrieved from database successfully",
            result: existing
        });
    }
    const { params } = yield (0, astrologyParams_1.getAstrologyApiParams)(req.user.userId || "");
    const apiUrl = `${env_1.env.MAHADASHA_API_URL}?${params}`;
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
    const result = yield (0, MahadashaSeve_1.saveMahaDashaFromApi)(userId, data, language);
    return res.json({
        success: true,
        message: "Mahadasha generated and saved successfully",
        result
    });
}));
function getExistingAntardasha(userId_1) {
    return __awaiter(this, arguments, void 0, function* (userId, language = 'en', isLLM) {
        const allRecords = yield db_1.db.AntharDasha.findAll({
            where: { user_id: String(userId) },
            order: [['set_no', 'ASC'], ['from', 'ASC']],
        });
        if (!allRecords || allRecords.length === 0) {
            return null;
        }
        const convertAntardashaToLanguage = (abbrev) => {
            const parts = abbrev.split('/');
            if (parts.length === 2) {
                const mahaTranslated = exports.planetsMaps[language][parts[0]] || parts[0];
                const antarTranslated = exports.planetsMaps[language][parts[1]] || parts[1];
                return `${mahaTranslated}/${antarTranslated}`;
            }
            return abbrev;
        };
        const today = new Date().toISOString().split('T')[0];
        const currentAntardasha = yield db_1.db.AntharDasha.findOne({
            where: {
                user_id: String(userId),
                from: { [sequelize_1.Op.lte]: today },
                to: { [sequelize_1.Op.gte]: today },
            },
        });
        let currentSetData = null;
        if (currentAntardasha) {
            const currentSetNo = currentAntardasha.set_no;
            const currentSet = yield db_1.db.AntharDasha.findAll({
                where: {
                    user_id: String(userId),
                    set_no: currentSetNo
                },
                order: [['from', 'ASC']],
            });
            currentSetData = currentSet.map(rec => ({
                anthardhashawa: convertAntardashaToLanguage(rec.anthardhashawa),
                from: rec.from,
                to: rec.to
            }));
        }
        const allAntardashasBySets = Array.from({ length: 9 }, (_, i) => i + 1).map(set_no => {
            const setRecords = allRecords.filter((rec) => rec.set_no === set_no);
            return setRecords.map(rec => ({
                anthardhashawa: convertAntardashaToLanguage(rec.anthardhashawa),
                from: rec.from,
                to: rec.to
            }));
        });
        const responseData = {
            current_antardasha: currentAntardasha ? {
                anthardhashawa: convertAntardashaToLanguage(currentAntardasha.anthardhashawa),
                setNo: currentAntardasha.set_no,
                from: currentAntardasha.from,
                to: currentAntardasha.to,
            } : null,
            current_antardasha_set: currentSetData,
            all_antardasha_sets: allAntardashasBySets
        };
        if (isLLM) {
            return responseData;
        }
        else {
            return {
                success: true,
                data: responseData,
                message: "Antardasha data retrieved successfully",
            };
        }
    });
}
exports.AntharDasha = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = yield (0, astrologyParams_1.getAstrologyApiParams)(req.user.userId || "");
    const user = yield db_1.db.Users.findByPk(userId, {
        include: [{
                model: db_1.db.Language,
                attributes: ['id', 'name'],
            }]
    });
    const userWithRelations = user;
    const language = ['en', 'ta', 'si'].includes(userWithRelations.Language.name) ? userWithRelations.Language.name : "en";
    const existing = yield getExistingAntardasha(userId, language);
    if (existing) {
        return res.json({
            success: true,
            message: "Antardasha retrieved from database successfully",
            result: existing
        });
    }
    const { params } = yield (0, astrologyParams_1.getAstrologyApiParams)(req.user.userId || "");
    const apiUrl = `${env_1.env.ANTHARDASHA_API_URL}?${params}`;
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
    const result = yield (0, anthardashaSeve_1.saveAntardashaFromApi)(userId, data, language);
    return res.json({
        success: true,
        message: "Anthar Dasha generated and saved successfully",
        result
    });
}));
function getExistingAstrologicalDetails(userId, isLLM) {
    return __awaiter(this, void 0, void 0, function* () {
        const savedRecord = yield db_1.db.AstrologicalDetails.findOne({
            where: { user_id: String(userId) },
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
        if (isLLM) {
            return responseData;
        }
        else {
            return {
                success: true,
                data: responseData,
                message: "Astrological details retrieved successfully",
            };
        }
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
            const apiUrl = `${env_1.env.ASCTROLOGIC_DATA_API_URL}?${params}`;
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
