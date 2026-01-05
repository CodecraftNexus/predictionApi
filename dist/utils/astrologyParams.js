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
function getAstrologyApiParams(userIdFromToken, Prediction, isNawam) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c, _d, _e, _f;
        const userId = userIdFromToken;
        const user = yield db_1.db.Users.findByPk(userId, {
            include: [
                {
                    model: db_1.db.Gender,
                    attributes: ['id', 'type'],
                },
                {
                    model: db_1.db.BirthLocation,
                    attributes: ['id', 'time_zone', 'name', 'latitude', 'longitude'],
                },
            ]
        });
        const userWithRelations = user;
        if (!user || !userWithRelations.Gender || !userWithRelations.BirthLocation) {
            throw { status: 400, message: 'Profile data missing' };
        }
        const isProfileComplete = ((_a = userWithRelations.Gender) === null || _a === void 0 ? void 0 : _a.type) &&
            userWithRelations.date_of_birth &&
            userWithRelations.birth_time &&
            ((_b = userWithRelations.BirthLocation) === null || _b === void 0 ? void 0 : _b.name) &&
            ((_c = userWithRelations.BirthLocation) === null || _c === void 0 ? void 0 : _c.latitude) != null &&
            ((_d = userWithRelations.BirthLocation) === null || _d === void 0 ? void 0 : _d.longitude) != null;
        if (!isProfileComplete) {
            throw { status: 400, message: 'Update your Profile' };
        }
        const formattedDate = (0, moment_1.default)(user.date_of_birth).format('DD/MM/YYYY');
        const formattedTime = (_f = (_e = user.birth_time) === null || _e === void 0 ? void 0 : _e.substring(0, 5)) !== null && _f !== void 0 ? _f : '';
        const apiKeyRecord = yield db_1.db.ApiKey.findByPk('1');
        if (!(apiKeyRecord === null || apiKeyRecord === void 0 ? void 0 : apiKeyRecord.key)) {
            throw { status: 500, message: 'API key not configured' };
        }
        const params = new URLSearchParams({
            api_key: apiKeyRecord.key,
            dob: formattedDate,
            tob: formattedTime,
            lat: String(userWithRelations.BirthLocation.latitude),
            lon: String(userWithRelations.BirthLocation.longitude),
            tz: '5.5',
            lang: 'en',
        });
        if (Prediction) {
            params.append('planet', Prediction);
        }
        const today = new Date();
        const day = today.getDate().toString().padStart(2, '0');
        const month = (today.getMonth() + 1).toString().padStart(2, '0');
        const year = today.getFullYear();
        const formattedDateToday = `${day}/${month}/${year}`;
        if (isNawam) {
            params.append('div', 'D9');
            params.append('response_type', 'planet_object');
            params.append('transit_date', formattedDateToday);
        }
        return { params, userId: String(userId) };
    });
}
