"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
exports.default = parseSinhalaDateToEnglish;
