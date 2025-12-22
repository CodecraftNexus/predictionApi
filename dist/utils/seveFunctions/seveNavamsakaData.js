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
exports.saveNavamsakaFromApi = void 0;
const db_1 = require("../../db");
const planetFirstLetterMap = {
    "රවි": "ර",
    "ච": "ච",
    "කු": "කු",
    "බු": "බු",
    "ගු": "ගු",
    "ශු": "ශු",
    "ශ": "ශ",
    "රා": "රා",
    "කේ": "කේ",
    "ලග්": ""
};
const saveNavamsakaFromApi = (userId, apiResponse) => __awaiter(void 0, void 0, void 0, function* () {
    const planets = apiResponse.response;
    if (!planets || !planets["0"]) {
        throw new Error("Invalid API response structure");
    }
    const lagnayaZodiac = planets["0"].zodiac;
    const boxData = {};
    for (let i = 1; i <= 12; i++) {
        boxData[`box${i}`] = [];
    }
    for (const key in planets) {
        if (key === "chart" || key === "chart_name")
            continue;
        const planet = planets[key];
        const planetName = planet.name;
        const houseNumber = planet.house;
        if (planetName === "ලග්")
            continue;
        const abbrev = planetFirstLetterMap[planetName];
        if (abbrev && houseNumber >= 1 && houseNumber <= 12) {
            boxData[`box${houseNumber}`].push(abbrev);
        }
    }
    const planetHouseData = {
        userId: String(userId),
        lagnaya: lagnayaZodiac,
        box1: boxData.box1.join(",") || null,
        box2: boxData.box2.join(",") || null,
        box3: boxData.box3.join(",") || null,
        box4: boxData.box4.join(",") || null,
        box5: boxData.box5.join(",") || null,
        box6: boxData.box6.join(",") || null,
        box7: boxData.box7.join(",") || null,
        box8: boxData.box8.join(",") || null,
        box9: boxData.box9.join(",") || null,
        box10: boxData.box10.join(",") || null,
        box11: boxData.box11.join(",") || null,
        box12: boxData.box12.join(",") || null,
    };
    const [navamsaka, created] = yield db_1.db.Navamsaka.findOrCreate({
        where: { userId: String(userId) },
        defaults: Object.assign({}, planetHouseData)
    });
    if (!created) {
        const updates = {};
        if (navamsaka.lagnaya !== planetHouseData.lagnaya) {
            updates.lagnaya = planetHouseData.lagnaya;
        }
        if (navamsaka.box1 !== planetHouseData.box1) {
            updates.box1 = planetHouseData.box1;
        }
        if (navamsaka.box2 !== planetHouseData.box2) {
            updates.box2 = planetHouseData.box2;
        }
        if (navamsaka.box3 !== planetHouseData.box3) {
            updates.box3 = planetHouseData.box3;
        }
        if (navamsaka.box4 !== planetHouseData.box4) {
            updates.box4 = planetHouseData.box4;
        }
        if (navamsaka.box5 !== planetHouseData.box5) {
            updates.box5 = planetHouseData.box5;
        }
        if (navamsaka.box6 !== planetHouseData.box6) {
            updates.box6 = planetHouseData.box6;
        }
        if (navamsaka.box7 !== planetHouseData.box7) {
            updates.box7 = planetHouseData.box7;
        }
        if (navamsaka.box8 !== planetHouseData.box8) {
            updates.box8 = planetHouseData.box8;
        }
        if (navamsaka.box9 !== planetHouseData.box9) {
            updates.box9 = planetHouseData.box9;
        }
        if (navamsaka.box10 !== planetHouseData.box10) {
            updates.box10 = planetHouseData.box10;
        }
        if (navamsaka.box11 !== planetHouseData.box11) {
            updates.box11 = planetHouseData.box11;
        }
        if (navamsaka.box12 !== planetHouseData.box12) {
            updates.box12 = planetHouseData.box12;
        }
        if (Object.keys(updates).length > 0) {
            yield navamsaka.update(updates);
        }
    }
    const savedRecord = yield db_1.db.Navamsaka.findOne({
        where: { userId: String(userId) },
    });
    if (!savedRecord) {
        throw new Error("Failed to retrieve saved navamsaka data");
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
        message: "Navamsaka data saved and retrieved successfully",
    };
});
exports.saveNavamsakaFromApi = saveNavamsakaFromApi;
