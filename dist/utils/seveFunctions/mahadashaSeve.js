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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveDashaFromApi = void 0;
const db_1 = require("../../db");
const parseSinhalaDateToEnglish_1 = __importDefault(require("../parseSinhalaDateToEnglish"));
const saveDashaFromApi = (userId, apiResponse) => __awaiter(void 0, void 0, void 0, function* () {
    const dashaData = apiResponse.response;
    if (!dashaData || !dashaData.mahadasha) {
        throw new Error("Invalid API response structure");
    }
    const dashaRecords = dashaData.mahadasha.map((planet, index) => {
        const fromDateSinhala = index === 0
            ? dashaData.dasha_start_date
            : dashaData.mahadasha_order[index - 1];
        const toDateSinhala = dashaData.mahadasha_order[index];
        return {
            userId: String(userId),
            dashawa: planet,
            From: (0, parseSinhalaDateToEnglish_1.default)(fromDateSinhala),
            To: (0, parseSinhalaDateToEnglish_1.default)(toDateSinhala)
        };
    });
    for (const record of dashaRecords) {
        const [dashaRecord, created] = yield db_1.db.DashaBalance.findOrCreate({
            where: {
                userId: String(userId),
                dashawa: record.dashawa
            },
            defaults: Object.assign({}, record)
        });
        if (!created) {
            const updates = {};
            if (dashaRecord.From !== record.From) {
                updates.From = record.From;
            }
            if (dashaRecord.To !== record.To) {
                updates.To = record.To;
            }
            if (Object.keys(updates).length > 0) {
                yield dashaRecord.update(updates);
            }
        }
    }
    const currentDate = new Date();
    const currentDateStr = currentDate.toISOString().split('T')[0];
    const savedRecords = yield db_1.db.DashaBalance.findAll({
        where: { userId: String(userId) },
        order: [['From', 'ASC']]
    });
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
            start_year: dashaData.start_year,
            dasha_start_date: dashaData.dasha_start_date,
            dasha_remaining_at_birth: dashaData.dasha_remaining_at_birth,
            current_dasha: currentDasha,
            current_mahadasha_set: currentMahadashaSet,
        },
        message: "Dasha data saved successfully",
    };
});
exports.saveDashaFromApi = saveDashaFromApi;
