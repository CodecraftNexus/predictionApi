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
exports.saveMahaDashaFromApi = exports.planetMaps = void 0;
const db_1 = require("../../db");
exports.planetMaps = {
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
const parseDateToISO = (dateStr) => {
    const date = new Date(dateStr);
    return date.toISOString().split('T')[0];
};
const saveMahaDashaFromApi = (userId_1, apiResponse_1, ...args_1) => __awaiter(void 0, [userId_1, apiResponse_1, ...args_1], void 0, function* (userId, apiResponse, language = 'en') {
    const dashaData = apiResponse.response;
    if (!dashaData || !dashaData.mahadasha) {
        throw new Error("Invalid API response structure");
    }
    const dashaRecords = dashaData.mahadasha.map((planet, index) => {
        const fromDateStr = index === 0
            ? dashaData.dasha_start_date
            : dashaData.mahadasha_order[index - 1];
        const toDateStr = dashaData.mahadasha_order[index];
        const planetAbbrev = planet;
        return {
            user_id: String(userId),
            dashawa: planetAbbrev,
            from: parseDateToISO(fromDateStr),
            to: parseDateToISO(toDateStr)
        };
    });
    for (const record of dashaRecords) {
        const [dashaRecord, created] = yield db_1.db.Mahadahsha.findOrCreate({
            where: {
                user_id: String(userId),
                dashawa: record.dashawa
            },
            defaults: Object.assign({}, record)
        });
        if (!created) {
            const updates = {};
            if (dashaRecord.from !== record.from) {
                updates.from = record.from;
            }
            if (dashaRecord.to !== record.to) {
                updates.to = record.to;
            }
            if (Object.keys(updates).length > 0) {
                yield dashaRecord.update(updates);
            }
        }
    }
    const currentDate = new Date();
    const currentDateStr = currentDate.toISOString().split('T')[0];
    const savedRecords = yield db_1.db.Mahadahsha.findAll({
        where: { user_id: String(userId) },
        order: [['from', 'ASC']]
    });
    let currentDasha = null;
    let currentMahadashaSet = null;
    let currentIndex = -1;
    const convertPlanetToLanguage = (abbrev) => {
        return exports.planetMaps[language][abbrev] || abbrev;
    };
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
    return {
        success: true,
        data: {
            start_year: dashaData.start_year,
            dasha_start_date: parseDateToISO(dashaData.dasha_start_date),
            dasha_remaining_at_birth: dashaData.dasha_remaining_at_birth,
            current_dasha: currentDasha,
            current_mahadasha_set: currentMahadashaSet,
        },
        message: "MahaDasha data saved successfully",
    };
});
exports.saveMahaDashaFromApi = saveMahaDashaFromApi;
