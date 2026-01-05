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
exports.saveAstrologicalDetailsFromApi = void 0;
const db_1 = require("../../db");
const saveAstrologicalDetailsFromApi = (userId, apiResponse) => __awaiter(void 0, void 0, void 0, function* () {
    const details = apiResponse.response;
    if (!details || !details.gana || !details.yoni || !details.vasya || !details.nadi || !details.varna ||
        !details.paya || !details.paya_by_nakshatra || !details.tatva || !details.life_stone ||
        !details.lucky_stone || !details.fortune_stone || !details.name_start || !details.ascendant_sign ||
        !details.ascendant_nakshatra || !details.rasi || !details.rasi_lord || !details.nakshatra ||
        !details.nakshatra_lord || typeof details.nakshatra_pada !== 'number' || !details.sun_sign ||
        !details.tithi || !details.karana || !details.yoga || typeof details.ayanamsa !== 'number') {
        throw new Error("Invalid astrological details API response structure");
    }
    yield db_1.db.AstrologicalDetails.destroy({
        where: { user_id: String(userId) },
    });
    const recordToSave = {
        user_id: String(userId),
        gana: details.gana,
        yoni: details.yoni,
        vasya: details.vasya,
        nadi: details.nadi,
        varna: details.varna,
        paya: details.paya,
        paya_by_nakshatra: details.paya_by_nakshatra,
        tatva: details.tatva,
        life_stone: details.life_stone,
        lucky_stone: details.lucky_stone,
        fortune_stone: details.fortune_stone,
        name_start: details.name_start,
        ascendant_sign: details.ascendant_sign,
        ascendant_nakshatra: details.ascendant_nakshatra,
        rasi: details.rasi,
        rasi_lord: details.rasi_lord,
        nakshatra: details.nakshatra,
        nakshatra_lord: details.nakshatra_lord,
        nakshatra_pada: details.nakshatra_pada,
        sun_sign: details.sun_sign,
        tithi: details.tithi,
        karana: details.karana,
        yoga: details.yoga,
        ayanamsa: details.ayanamsa,
    };
    yield db_1.db.AstrologicalDetails.create(recordToSave);
    return {
        success: true,
        data: recordToSave,
        message: "Astrological details saved successfully",
    };
});
exports.saveAstrologicalDetailsFromApi = saveAstrologicalDetailsFromApi;
