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
exports.saveAntardashaFromApi = exports.planetMaps = void 0;
const sequelize_1 = require("sequelize");
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
const saveAntardashaFromApi = (userId_1, apiResponse_1, ...args_1) => __awaiter(void 0, [userId_1, apiResponse_1, ...args_1], void 0, function* (userId, apiResponse, language = 'en') {
    const { antardashas, antardasha_order } = apiResponse.response;
    if (!antardashas || !antardasha_order || antardashas.length !== 9) {
        throw new Error("Invalid antardasha API response structure");
    }
    const mahaRecords = yield db_1.db.Mahadahsha.findAll({
        where: { user_id: userId },
        order: [['from', 'ASC']],
    });
    if (mahaRecords.length !== 9) {
        throw new Error("Mahadasha data not found or incomplete. Save mahadasha first.");
    }
    yield db_1.db.AntharDasha.destroy({
        where: { user_id: userId },
    });
    const antarRecordsToSave = [];
    for (let setIndex = 0; setIndex < 9; setIndex++) {
        const set_no = setIndex + 1;
        const mahaFrom = mahaRecords[setIndex].from;
        let currentFrom = mahaFrom;
        const names = antardashas[setIndex];
        const endDates = antardasha_order[setIndex];
        for (let i = 0; i < 9; i++) {
            const anthardhashawa = names[i];
            const toDateStr = endDates[i];
            const To = parseDateToISO(toDateStr);
            antarRecordsToSave.push({
                user_id: userId,
                anthardhashawa: anthardhashawa,
                set_no: set_no,
                from: currentFrom,
                to: To,
            });
            currentFrom = To;
        }
    }
    yield db_1.db.AntharDasha.bulkCreate(antarRecordsToSave);
    const convertAntardashaToLanguage = (abbrev) => {
        const parts = abbrev.split('/');
        if (parts.length === 2) {
            const mahaTranslated = exports.planetMaps[language][parts[0]] || parts[0];
            const antarTranslated = exports.planetMaps[language][parts[1]] || parts[1];
            return `${mahaTranslated}/${antarTranslated}`;
        }
        return abbrev;
    };
    const today = new Date().toISOString().split('T')[0];
    const currentAntardasha = yield db_1.db.AntharDasha.findOne({
        where: {
            user_id: userId,
            from: { [sequelize_1.Op.lte]: today },
            to: { [sequelize_1.Op.gte]: today },
        },
    });
    let currentSetData = null;
    if (currentAntardasha) {
        const currentSetNo = currentAntardasha.set_no;
        const currentSet = yield db_1.db.AntharDasha.findAll({
            where: {
                user_id: userId,
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
    return {
        success: true,
        data: {
            total_antardashas_saved: antarRecordsToSave.length,
            current_antardasha: currentAntardasha ? {
                anthardhashawa: convertAntardashaToLanguage(currentAntardasha.anthardhashawa),
                set_no: currentAntardasha.set_no,
                from: currentAntardasha.from,
                to: currentAntardasha.to,
            } : null,
            current_antardasha_set: currentSetData,
        },
        message: "Antardasha data saved successfully",
    };
});
exports.saveAntardashaFromApi = saveAntardashaFromApi;
