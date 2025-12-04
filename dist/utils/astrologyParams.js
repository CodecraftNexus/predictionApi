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
exports.getAstrologyApiParams = getAstrologyApiParams;
const moment_1 = __importDefault(require("moment"));
const db_1 = require("../db");
function getAstrologyApiParams(userIdFromToken, Prediction) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b;
        const userId = Number(userIdFromToken);
        if (isNaN(userId)) {
            throw { status: 400, message: 'Invalid user id' };
        }
        const user = yield db_1.db.User.findByPk(userId, {
            include: [
                { model: db_1.db.Gender, as: 'gender', attributes: ['type'] },
                { model: db_1.db.BirthLocation, as: 'birthLocation', attributes: ['name', 'latitude', 'longitude'] }
            ]
        });
        if (!user || !user.gender || !user.birthLocation) {
            throw { status: 400, message: 'Profile data missing' };
        }
        const isProfileComplete = user.gender.type &&
            user.dateOfBirth &&
            user.birthTime &&
            user.birthLocation.name &&
            user.birthLocation.latitude != null &&
            user.birthLocation.longitude != null;
        if (!isProfileComplete) {
            throw { status: 400, message: 'Update your Profile' };
        }
        const formattedDate = (0, moment_1.default)(user.dateOfBirth).format('DD/MM/YYYY');
        const formattedTime = (_b = (_a = user.birthTime) === null || _a === void 0 ? void 0 : _a.substring(0, 5)) !== null && _b !== void 0 ? _b : '';
        const apiKeyRecord = yield db_1.db.ApiKey.findByPk('1');
        if (!(apiKeyRecord === null || apiKeyRecord === void 0 ? void 0 : apiKeyRecord.key)) {
            throw { status: 500, message: 'API key not configured' };
        }
        const params = new URLSearchParams({
            api_key: apiKeyRecord.key,
            dob: formattedDate,
            tob: formattedTime,
            lat: String(user.birthLocation.latitude),
            lon: String(user.birthLocation.longitude),
            tz: '5.5',
            lang: 'si',
        });
        if (Prediction) {
            params.append('planet', Prediction);
        }
        return { params, userId };
    });
}
