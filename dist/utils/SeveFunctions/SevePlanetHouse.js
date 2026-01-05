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
exports.savePlanetHouseFromApi = void 0;
const db_1 = require("../../db");
const planetMaps_1 = require("../translation/planetMaps");
const MahadashaSeve_1 = require("./MahadashaSeve");
const savePlanetHouseFromApi = (userId_1, apiResponse_1, ...args_1) => __awaiter(void 0, [userId_1, apiResponse_1, ...args_1], void 0, function* (userId, apiResponse, language = 'en') {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
    const houses = apiResponse.response;
    if (!houses || !houses["1"]) {
        throw new Error("Invalid API response structure");
    }
    const lagnayaZodiac = houses["1"].zodiac;
    const boxData = {};
    for (let i = 1; i <= 12; i++) {
        const houseKey = i.toString();
        const house = houses[houseKey];
        if (!house) {
            boxData[`box${i}`] = "";
            continue;
        }
        const planetsInHouse = house.planets
            .filter((p) => p !== "Ascendant")
            .map((p) => {
            const planetMap = {
                "Sun": "Su",
                "Moon": "Mo",
                "Mars": "Ma",
                "Mercury": "Me",
                "Jupiter": "Ju",
                "Venus": "Ve",
                "Saturn": "Sa",
                "Rahu": "Ra",
                "Ketu": "Ke"
            };
            return planetMap[p] || "";
        })
            .filter(Boolean)
            .join(",");
        boxData[`box${i}`] = planetsInHouse;
    }
    const planetHouseData = {
        user_id: String(userId),
        lagnaya: lagnayaZodiac,
        box1: boxData.box1 || null,
        box2: boxData.box2 || null,
        box3: boxData.box3 || null,
        box4: boxData.box4 || null,
        box5: boxData.box5 || null,
        box6: boxData.box6 || null,
        box7: boxData.box7 || null,
        box8: boxData.box8 || null,
        box9: boxData.box9 || null,
        box10: boxData.box10 || null,
        box11: boxData.box11 || null,
        box12: boxData.box12 || null,
    };
    const [planetHouse, created] = yield db_1.db.PlanetHouse.findOrCreate({
        where: { user_id: String(userId) },
        defaults: Object.assign({}, planetHouseData)
    });
    if (!created) {
        const updates = {};
        for (let i = 1; i <= 12; i++) {
            const boxKey = `box${i}`;
            if (planetHouse[boxKey] !== planetHouseData[boxKey]) {
                updates[boxKey] = planetHouseData[boxKey];
            }
        }
        if (planetHouse.lagnaya !== planetHouseData.lagnaya) {
            updates.lagnaya = planetHouseData.lagnaya;
        }
        if (Object.keys(updates).length > 0) {
            yield planetHouse.update(updates);
        }
    }
    const savedRecord = yield db_1.db.PlanetHouse.findOne({
        where: { user_id: String(userId) },
    });
    if (!savedRecord) {
        throw new Error("Failed to retrieve saved planet house data");
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
            return MahadashaSeve_1.planetMaps[language][fullName] || abbrev;
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
    return {
        success: true,
        data: responseData,
        message: "Planet house data saved and retrieved successfully",
    };
});
exports.savePlanetHouseFromApi = savePlanetHouseFromApi;
