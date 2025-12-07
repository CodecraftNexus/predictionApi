"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Navamsaka = exports.ProfileImage = exports.EducationqualificationsCatagory = exports.Educationqualifications = exports.EducationqualificationsItem = exports.Jobs = exports.JobsCategory = exports.JobsItem = exports.PredictionPlanet = exports.Predictions = exports.AntharDasha = exports.DashaBalance = exports.PalentHouse = exports.ApiKey = exports.OAuthAccount = exports.RefreshToken = exports.Gender = exports.BirthLocation = exports.User = void 0;
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
const Predictions_1 = require("./Predictions");
Object.defineProperty(exports, "Predictions", { enumerable: true, get: function () { return Predictions_1.Predictions; } });
const PredictionPlanet_1 = require("./PredictionPlanet");
Object.defineProperty(exports, "PredictionPlanet", { enumerable: true, get: function () { return PredictionPlanet_1.PredictionPlanet; } });
const JobsItem_1 = require("./JobsItem");
Object.defineProperty(exports, "JobsItem", { enumerable: true, get: function () { return JobsItem_1.JobsItem; } });
const JobCategory_1 = require("./JobCategory");
Object.defineProperty(exports, "JobsCategory", { enumerable: true, get: function () { return JobCategory_1.JobsCategory; } });
const Jobs_1 = require("./Jobs");
Object.defineProperty(exports, "Jobs", { enumerable: true, get: function () { return Jobs_1.Jobs; } });
const EducationqualificationsItem_1 = require("./EducationqualificationsItem");
Object.defineProperty(exports, "EducationqualificationsItem", { enumerable: true, get: function () { return EducationqualificationsItem_1.EducationqualificationsItem; } });
const Educationqualifications_1 = require("./Educationqualifications");
Object.defineProperty(exports, "Educationqualifications", { enumerable: true, get: function () { return Educationqualifications_1.Educationqualifications; } });
const EducationqualificationsCategory_1 = require("./EducationqualificationsCategory");
Object.defineProperty(exports, "EducationqualificationsCatagory", { enumerable: true, get: function () { return EducationqualificationsCategory_1.EducationqualificationsCatagory; } });
const ProfileImage_1 = require("./ProfileImage");
Object.defineProperty(exports, "ProfileImage", { enumerable: true, get: function () { return ProfileImage_1.ProfileImage; } });
const Navamsaka_1 = require("./Navamsaka");
Object.defineProperty(exports, "Navamsaka", { enumerable: true, get: function () { return Navamsaka_1.Navamsaka; } });
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
    Predictions: Predictions_1.Predictions,
    PredictionPlanet: PredictionPlanet_1.PredictionPlanet,
    JobsItem: JobsItem_1.JobsItem,
    JobsCategory: JobCategory_1.JobsCategory,
    Jobs: Jobs_1.Jobs,
    EducationqualificationsItem: EducationqualificationsItem_1.EducationqualificationsItem,
    Educationqualifications: Educationqualifications_1.Educationqualifications,
    EducationqualificationsCatagory: EducationqualificationsCategory_1.EducationqualificationsCatagory,
    ProfileImage: ProfileImage_1.ProfileImage,
    Navamsaka: Navamsaka_1.Navamsaka,
};
(0, hooks_1.initHooks)(models);
(0, relationships_1.initRelationship)(models);
