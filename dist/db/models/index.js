"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sunPrediction = exports.AntharDasha = exports.DashaBalance = exports.PalentHouse = exports.ApiKey = exports.OAuthAccount = exports.RefreshToken = exports.Gender = exports.BirthLocation = exports.User = void 0;
const User_1 = require("./User");
Object.defineProperty(exports, "User", { enumerable: true, get: function () { return User_1.User; } });
const hooks_1 = require("../hooks");
const BirthLoacation_1 = require("./BirthLoacation");
Object.defineProperty(exports, "BirthLocation", { enumerable: true, get: function () { return BirthLoacation_1.BirthLocation; } });
const Gender_1 = require("./Gender");
Object.defineProperty(exports, "Gender", { enumerable: true, get: function () { return Gender_1.Gender; } });
const RefreshToken_1 = require("./RefreshToken");
Object.defineProperty(exports, "RefreshToken", { enumerable: true, get: function () { return RefreshToken_1.RefreshToken; } });
const relationships_1 = require("../relationships");
const OAuthAccount_1 = require("./OAuthAccount");
Object.defineProperty(exports, "OAuthAccount", { enumerable: true, get: function () { return OAuthAccount_1.OAuthAccount; } });
const ApiKey_1 = require("./ApiKey");
Object.defineProperty(exports, "ApiKey", { enumerable: true, get: function () { return ApiKey_1.ApiKey; } });
const PlanetHouse_1 = require("./PlanetHouse");
Object.defineProperty(exports, "PalentHouse", { enumerable: true, get: function () { return PlanetHouse_1.PalentHouse; } });
const DashaBalance_1 = require("./DashaBalance");
Object.defineProperty(exports, "DashaBalance", { enumerable: true, get: function () { return DashaBalance_1.DashaBalance; } });
const AntharDasha_1 = require("./AntharDasha");
Object.defineProperty(exports, "AntharDasha", { enumerable: true, get: function () { return AntharDasha_1.AntharDasha; } });
const PredictionSun_1 = require("./PredictionSun");
Object.defineProperty(exports, "sunPrediction", { enumerable: true, get: function () { return PredictionSun_1.sunPrediction; } });
const models = {
    User: User_1.User,
    BirthLocation: BirthLoacation_1.BirthLocation,
    Gender: Gender_1.Gender,
    RefreshToken: RefreshToken_1.RefreshToken,
    OAuthAccount: OAuthAccount_1.OAuthAccount,
    ApiKey: ApiKey_1.ApiKey,
    PalentHouse: PlanetHouse_1.PalentHouse,
    DashaBalance: DashaBalance_1.DashaBalance,
    AntharDasha: AntharDasha_1.AntharDasha,
    sunPrediction: PredictionSun_1.sunPrediction
};
(0, hooks_1.initHooks)(models);
(0, relationships_1.initRelationship)(models);
