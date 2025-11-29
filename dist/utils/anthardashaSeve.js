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
exports.saveAntardashaFromApi = void 0;
const sequelize_1 = require("sequelize");
const db_1 = require("../db");
const parseSinhalaDateToEnglish = (dateStr) => {
    var _a;
    const parts = dateStr.trim().split(/\s+/).filter(Boolean);
    if (parts.length < 4) {
        throw new Error(`Invalid Sinhala date format: ${dateStr}`);
    }
    const year = parts[parts.length - 1];
    const day = parts[parts.length - 2].padStart(2, '0');
    const monthStr = parts[1];
    const monthMap = {
        'ජන': '01', 'ජන.': '01', 'ජනවාරි': '01',
        'පෙබ': '02', 'පෙබ.': '02', 'පෙබරවාරි': '02',
        'මාර්': '03', 'මාර්.': '03', 'මාර්තු': '03',
        'අප්': '04', 'අප්‍රේල්': '04',
        'මැයි': '05',
        'ජුනි': '06', 'ජූනි': '06',
        'ජූලි': '07',
        'අගෝ': '08', 'අගෝ.': '08', 'අගෝස්තු': '08',
        'සැප්': '09', 'සැප්.': '09', 'සැප්තැම්බර්': '09',
        'ඔක්': '10', 'ඔක්.': '10', 'ඔක්තෝබර්': '10',
        'නොවැ': '11', 'නොවැ.': '11', 'නොවැම්බර්': '11',
        'දෙසැ': '12', 'දෙසැ.': '12', 'දෙසැම්බර්': '12',
    };
    const month = monthMap[monthStr] || ((_a = Object.entries(monthMap).find(([key]) => monthStr.startsWith(key))) === null || _a === void 0 ? void 0 : _a[1]);
    if (!month) {
        throw new Error(`Unknown month in date: ${dateStr}`);
    }
    return `${year}-${month}-${day}`;
};
const saveAntardashaFromApi = (userId, apiResponse) => __awaiter(void 0, void 0, void 0, function* () {
    const { antardashas, antardasha_order } = apiResponse.response;
    if (!antardashas || !antardasha_order || antardashas.length !== 9) {
        throw new Error("Invalid antardasha API response structure");
    }
    const mahaRecords = yield db_1.db.DashaBalance.findAll({
        where: { userId: String(userId) },
        order: [['From', 'ASC']],
    });
    if (mahaRecords.length !== 9) {
        throw new Error("Mahadasha data not found or incomplete. Save mahadasha first.");
    }
    const antarRecordsToSave = [];
    for (let setIndex = 0; setIndex < 9; setIndex++) {
        const setNo = setIndex + 1;
        const mahaFrom = mahaRecords[setIndex].From;
        let currentFrom = mahaFrom;
        const names = antardashas[setIndex];
        const endDates = antardasha_order[setIndex];
        for (let i = 0; i < 9; i++) {
            const anthardhashawa = names[i];
            const toDateSinhala = endDates[i];
            const To = parseSinhalaDateToEnglish(toDateSinhala);
            antarRecordsToSave.push({
                userId: String(userId),
                anthardhashawa,
                setNo,
                From: currentFrom,
                To,
            });
            currentFrom = To;
        }
    }
    for (const record of antarRecordsToSave) {
        const [antarRecord, created] = yield db_1.db.AntharDasha.findOrCreate({
            where: {
                userId: record.userId,
                setNo: record.setNo,
                anthardhashawa: record.anthardhashawa,
            },
            defaults: record,
        });
        if (!created) {
            yield antarRecord.update({
                From: record.From,
                To: record.To,
            });
        }
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
            order: [['From', 'ASC']]
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
            total_antardashas_saved: antarRecordsToSave.length,
            current_antardasha: currentAntardasha ? {
                anthardhashawa: currentAntardasha.anthardhashawa,
                setNo: currentAntardasha.setNo,
                from: currentAntardasha.From,
                to: currentAntardasha.To,
            } : null,
            current_antardasha_set: currentSetData,
        },
        message: "Antardasha data saved successfully",
    };
});
exports.saveAntardashaFromApi = saveAntardashaFromApi;
